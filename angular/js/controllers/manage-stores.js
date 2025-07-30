'use strict';

angular.module('app').controller('ManageStoresController', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
    $scope.stores = [];
    $scope.store = {};
    $scope.loading = false;
    $scope.saving = false;
    let imageFile = null;

    const supabase = window.supabase;

    // --- Data Loading Functions ---

    // Fetches all stores for the list view
    async function loadStores() {
        $scope.loading = true;
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching stores:', error);
            alert('Error fetching stores: ' + error.message);
        } else {
            $scope.stores = data;
        }
        $scope.loading = false;
        $scope.$apply();
    }

    // Fetches a single store for the edit view
    async function loadStore(id) {
        $scope.loading = true;
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('id', id)
            .single(); // Use .single() to get one object

        if (error) {
            console.error('Error fetching store:', error);
            alert('Error fetching store: ' + error.message);
            $state.go('app.managestores.list'); // Go back if store not found
        } else {
            $scope.store = data;
        }
        $scope.loading = false;
        $scope.$apply();
    }

    // --- UI Interaction Functions ---

    // Handles file input change
    $scope.setFile = function(element) {
        if (element.files && element.files.length > 0) {
            imageFile = element.files[0];
        }
    };

    // Navigates to the edit page
    $scope.editStore = function(storeId) {
        $state.go('app.managestores.edit', { storeId: storeId });
    };

    // Deletes a store
    $scope.deleteStore = async function(id) {
        if (!confirm('Are you sure you want to delete this store?')) return;

        try {
            // Find the store in the current list to get its image URL
            const storeToDelete = $scope.stores.find(s => s.id === id);

            // First, delete the record from the database
            const { error: dbError } = await supabase
                .from('stores')
                .delete()
                .eq('id', id);

            if (dbError) {
                throw dbError; // If DB deletion fails, stop here
            }

            // If DB deletion is successful and there was an image, delete it from storage
            if (storeToDelete && storeToDelete.image_url) {
                const imageUrl = storeToDelete.image_url;
                const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

                const { error: storageError } = await supabase.storage
                    .from('store-images')
                    .remove([fileName]);

                if (storageError) {
                    // Log storage error but don't show a breaking alert
                    console.error('Failed to delete image from storage:', storageError);
                }
            }

            await loadStores(); // Refresh the UI
        } catch (error) {
            console.error('Error during store deletion:', error);
            alert('Error deleting store: ' + error.message);
        }
    };

    // --- Form Submission ---

    // Uploads the image file to Supabase Storage
    async function uploadImage() {
        if (!imageFile) return null;

        const fileName = `${Date.now()}_${imageFile.name}`;
        const { data, error } = await supabase.storage
            .from('store-images')
            .upload(fileName, imageFile);

        if (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('store-images')
            .getPublicUrl(fileName);
            
        return publicUrl;
    }

    // Saves a new store or updates an existing one
    $scope.saveStore = async function() {
        if ($scope.storeForm.$invalid) {
            alert('Please fill out all required fields.');
            return;
        }

        $scope.saving = true;
        if (!$scope.$$phase) $scope.$apply();

        try {
            if (imageFile) {
                const imageUrl = await uploadImage();
                if (imageUrl) {
                    $scope.store.image_url = imageUrl;
                } else {
                    // uploadImage function already shows an alert on failure
                    return;
                }
            }

            let response;
            // Check if we are editing (store will have an id)
            if ($scope.store.id) {
                const { id, created_at, ...updateData } = $scope.store;
                response = await supabase
                    .from('stores')
                    .update(updateData)
                    .eq('id', id);
            } else {
                // Adding a new store
                response = await supabase
                    .from('stores')
                    .insert([$scope.store]);
            }

            if (response.error) {
                throw response.error;
            }

            $state.go('app.managestores.list');

        } catch (error) {
            console.error('Error saving store:', error);
            alert('Error saving store: ' + error.message);
        } finally {
            $scope.saving = false;
            imageFile = null; // Reset image file after attempting to save
            if (!$scope.$$phase) $scope.$apply();
        }
    };

    // --- Controller Initialization ---
    function init() {
        const currentState = $state.current.name;

        if (currentState === 'app.managestores.list') {
            loadStores();
        } else if (currentState === 'app.managestores.edit') {
            const storeId = $stateParams.storeId;
            if (storeId) {
                loadStore(storeId);
            } else {
                $state.go('app.managestores.list'); // Redirect if no ID
            }
        } else if (currentState === 'app.managestores.add') {
            // Just need an empty store object, which is already initialized.
            $scope.store = {};
        }
    }

    init();
}]);
