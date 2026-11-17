const itemForm = document.getElementById("item-form");

const itemNameInput = document.getElementById("item-name");
const itemCategoryInput = document.getElementById("item-category");
const itemRoomInput = document.getElementById("item-room");
const itemLocationInput = document.getElementById("item-location");

const cancelEditButton = document.getElementById("cancel-edit-btn");
const submitButton = document.getElementById("submit-btn");

const searchInput = document.getElementById("search-input");

const itemsContainer = document.getElementById("items-container");
const searchResultsContainer = document.getElementById("search-results-container");

const categoryFilter = document.getElementById("category-filter");
const roomFilter = document.getElementById("room-filter");

const itemsCount = document.getElementById("items-count");

const totalItemsCount = document.getElementById("total-items-count");
const totalRoomsCount = document.getElementById("total-rooms-count");

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

const formHeading = document.getElementById("form-heading");
const formDescription = document.getElementById("form-description");

const editingItemInfo = document.getElementById("editing-item-info");
const editingItemName = document.getElementById("editing-item-name");

const toast = document.getElementById("toast");

const deleteModal = document.getElementById("delete-modal");
const deleteModalMessage = document.getElementById("delete-modal-message");

const cancelDeleteButton = document.getElementById("cancel-delete-btn");
const confirmDeleteButton = document.getElementById("confirm-delete-btn");


let items = JSON.parse(localStorage.getItem("items")) || [];

let editingItemId = null;

let itemToDeleteId = null;


function saveItems() {
    localStorage.setItem("items", JSON.stringify(items));
}



function updateStats() {

    totalItemsCount.textContent = items.length;

    const uniqueRooms = new Set(
        items.map(item => item.room)
    );

    totalRoomsCount.textContent = uniqueRooms.size;

}


function displayItems(itemsToDisplay, container) {

    container.replaceChildren();

    if (container === itemsContainer) {

        itemsCount.textContent =
            `${items.length} ${items.length === 1 ? "item" : "items"}`;
    }

    if (itemsToDisplay.length === 0) {

        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("empty-state");

        const emptyIcon = document.createElement("i");
        const emptyTitle = document.createElement("h3");
        const emptyDescription = document.createElement("p");

        if (container === itemsContainer && items.length === 0) {

            emptyIcon.setAttribute("data-lucide", "package-open");

            emptyTitle.textContent = "Your inventory is empty";

            emptyDescription.textContent =
                "Start by adding your first belonging";

        } else {

            emptyIcon.setAttribute("data-lucide", "search-x");

            emptyTitle.textContent = "No items found";

            emptyDescription.textContent =
                "Try changing your search or filters.";

        }

        emptyMessage.append(
            emptyIcon,
            emptyTitle,
            emptyDescription
        );

        container.appendChild(emptyMessage);

        lucide.createIcons();

        return;
    }


    
    itemsToDisplay.forEach(function(item) {

        const itemCard = document.createElement("div");
        itemCard.classList.add("item-card");

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("item-card-header");

        const itemTitle = document.createElement("h3");
        itemTitle.textContent = item.name;

        const categoryBadge = document.createElement("span");
        categoryBadge.textContent = item.category;
        categoryBadge.classList.add("category-badge");

        cardHeader.append(itemTitle, categoryBadge);

        const roomInfo = document.createElement("div");
        roomInfo.classList.add("item-info");

        const roomIcon = document.createElement("i");
        roomIcon.setAttribute("data-lucide", "house");

        const roomText = document.createElement("span");
        roomText.textContent = item.room;

        roomInfo.append(roomIcon, roomText);


        const locationInfo = document.createElement("div");
        locationInfo.classList.add("item-info");

        const locationIcon = document.createElement("i");
        locationIcon.setAttribute("data-lucide", "map-pin");

        const locationText = document.createElement("span");
        locationText.textContent = item.location;

        locationInfo.append(locationIcon, locationText);


        const cardActions = document.createElement("div");
        cardActions.classList.add("item-actions");

        const editButton = document.createElement("button");
        editButton.innerHTML = '<i data-lucide="pencil"></i> Edit';
        editButton.classList.add("edit-btn");
        editButton.dataset.id = item.id;
        editButton.type = "button";

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i data-lucide="trash-2"></i> Delete';
        deleteButton.classList.add("delete-btn");
        deleteButton.dataset.id = item.id;
        deleteButton.type = "button";

        cardActions.append(editButton, deleteButton);


        itemCard.append(
            cardHeader,
            roomInfo,
            locationInfo,
            cardActions
        );

        container.appendChild(itemCard);

        editButton.addEventListener("click", function() {

            const id = Number(this.dataset.id);
            editItem(id);

        });


        deleteButton.addEventListener("click", function() {

            const id = Number(this.dataset.id);
            deleteItem(id);

        });

    });

    lucide.createIcons();
}


function renderItems() {

    displayItems(items, itemsContainer);
    filterItems();
    updateStats();

}


function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);
    selectedPage.classList.add("active-page");

    const selectedButton = document.querySelector(
        `[data-page="${pageId}"]`
    );

    selectedButton.classList.add("active");

}


function deleteItem(id) {

    const item = items.find(function(item) {
        return item.id === id;
    });

    if (!item) return;

    itemToDeleteId = id;

    deleteModalMessage.textContent =
        `Are you sure you want to delete "${item.name}"?`;

    deleteModal.hidden = false;

    lucide.createIcons();
}


function editItem(id) {

    showPage("add-page");

    const item = items.find(function(item) {
        return item.id === id;
    });

    if (!item) {
        return;
    }

    itemNameInput.value = item.name;
    itemCategoryInput.value = item.category;
    itemRoomInput.value = item.room;
    itemLocationInput.value = item.location;

    editingItemId = id;

    formHeading.textContent = "Editing Item";

    formDescription.textContent =
        "Update the information about your belonging.";

    editingItemName.textContent = item.name;
    editingItemInfo.hidden = false;

    submitButton.innerHTML = '<i data-lucide="save"></i> Update Item';

    cancelEditButton.hidden = false;

    lucide.createIcons();

}


function cancelEdit() {

    editingItemId = null;

    itemForm.reset();

    formHeading.textContent = "Add a New Item";

    formDescription.textContent =
        "Record where you put your belongings";
    editingItemInfo.hidden = true;

    editingItemName.textContent = "";

    submitButton.innerHTML = '<i data-lucide="plus"></i> Add Item';

    cancelEditButton.hidden = true;

    lucide.createIcons();

}


function filterItems() {

    const searchText = searchInput.value.trim().toLowerCase();

    const selectedCategory = categoryFilter.value;
    const selectedRoom = roomFilter.value;

    const filteredItems = items.filter(function(item) {

        const matchesName =
            item.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "" ||
            item.category === selectedCategory;

        const matchesRoom =
            selectedRoom === "" ||
            item.room === selectedRoom;

        return matchesName && matchesCategory && matchesRoom;

    });

    displayItems(filteredItems, searchResultsContainer);

}


let toastTimeout;

function showToast(message, type = "success") {

    clearTimeout(toastTimeout);

    toast.textContent = message;
    toast.className = `toast ${type} show`;
    toastTimeout = setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);
}

cancelEditButton.addEventListener("click", cancelEdit);
searchInput.addEventListener("input", filterItems);
categoryFilter.addEventListener("change", filterItems);
roomFilter.addEventListener("change", filterItems);


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const pageId = button.dataset.page;

        showPage(pageId);

    });

});


itemForm.addEventListener("submit", function(event) {


    event.preventDefault();

    const name = itemNameInput.value.trim();
    const category = itemCategoryInput.value;
    const room = itemRoomInput.value;
    const location = itemLocationInput.value.trim();

    const wasEditing = editingItemId !== null;


    if (editingItemId === null) {

        const newItem = {
            id: Date.now(),
            name: name,
            category: category,
            room: room,
            location: location
        };

        items.push(newItem);

    } else {

        const item = items.find(function(item) {
            return item.id === editingItemId;
        });

        if (!item) {
            return;
        }

        item.name = name;
        item.category = category;
        item.room = room;
        item.location = location;

    }

    cancelEdit();
    saveItems();

    showToast(
    wasEditing
        ? "Item added successfully"
        : "Item updated successfully"
    );  

    renderItems();

});

cancelDeleteButton.addEventListener("click", function() {

    deleteModal.hidden = true;
    itemToDeleteId = null;
});


confirmDeleteButton.addEventListener("click", function() {

    if (itemToDeleteId === null) return;

    const id = itemToDeleteId;

    if (editingItemId === id) {
        cancelEdit();
    }

    items = items.filter(function(item) {
        return item.id !== id;
    });

    saveItems();

    deleteModal.hidden = true;
    itemToDeleteId = null;

    showToast("Item deleted successfully");
    renderItems();
});

lucide.createIcons();

renderItems();
