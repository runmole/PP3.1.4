document.addEventListener("DOMContentLoaded", function () {
    fetchCurrentUser();
    fetchAllUsers();
    setupCloseButtons();
});

function fetchCurrentUser() {
    fetch('/api/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('a gde svyazi?? aloo');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            document.getElementById('navbarEmail').textContent = data.email;
            document.getElementById('navbarRoles').textContent = data.roles.map(role => role.role.replace('ROLE_', '')).join(', ');

            document.getElementById('userId').textContent = data.id;
            document.getElementById('userFirstName').textContent = data.firstName;
            document.getElementById('userLastName').textContent = data.lastName;
            document.getElementById('userAge').textContent = data.age;
            document.getElementById('userEmail').textContent = data.email;
            document.getElementById('userRoles').textContent = data.roles.map(role => role.role.replace('ROLE_', '')).join(', ');
        })
        .catch(error => {
            console.error('Oshibka fetchinga: ', error);
        });
}

function fetchAllUsers() {
    fetch('/api/admin/')
        .then(response => {
            if (!response.ok) {
                throw new Error('a gde svyaz?? aloo');
            }
            return response.json();
        })
        .then(users => {
            console.log(users);
            const usersTableBody = document.getElementById('usersTableBody');
            usersTableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.role.replace('ROLE_', '')).join(', ')}</td>
                    
                    <td><button class="btn btn-info" onclick="openEditUserPopup(${user.id})">Edit</button></td>
                    <td><button class="btn btn-danger" onclick="openDeleteUserPopup(${user.id})">Delete</button></td>
                    `;

                usersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Oshibka fetchinga: ', error);
        });
}


document.getElementById('addUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const rolesSelected = Array.from(document.getElementById('roles').selectedOptions).map(option => ({
        id: parseInt(option.value, 10)
    }));
    const user = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        age: parseInt(formData.get('age'), 10),
        email: formData.get('email'),
        password: formData.get('password'),
        roles: rolesSelected
    };
    console.log('Creating user:', user);
    fetch('api/admin/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                this.reset();
                fetchAllUsers();
                window.location.href = '/admin';// Обновляем таблицу пользователей

            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Не удалось создать пользователя');
                });
            }
        })
        .catch(error => {
            console.error('Error creating user:', error);
            alert('Ошибка при создании пользователя: ' + error.message);
        });
});

function openEditUserPopup(userId) {
    console.log('Opening edit modal for user ID:', userId);
    fetch(`api/admin/updateUser/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return response.json();
        })
        .then(user => {
            console.log('User fetched for edit:', user);
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editSurname').value = user.surname;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPassword').value = user.password;
            const editRolesSelect = document.getElementById('editRoles');
            Array.from(editRolesSelect.options).forEach(option => {
                option.selected = user.roles.some(role => role.id === parseInt(option.value, 10));
            });
            openModal('editUserModal');
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
}

// Обработчик отправки формы редактирования пользователя
document.getElementById('editUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const userId = parseInt(formData.get('id'), 10);
    const rolesSelected = Array.from(document.getElementById('editRoles').selectedOptions).map(option => ({
        id: parseInt(option.value, 10)
    }));
    const user = {
        id: userId, // ID пользователя обязательно
        username: formData.get('editUsername'),
        surname: formData.get('editSurname'),
        age: parseInt(formData.get('editAge'), 10),
        email: formData.get('editEmail'),
        password: formData.get('editPassword'),
        roles: rolesSelected
    };
    console.log('Updating user:', user);
    fetch(`api/admin/updateUser`, { // Исправлен путь
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                fetchUsers(); // Перезагрузка таблицы

                closeModal('editUserModal');

                window.location.href = 'api/admin';
            } else {
                return response.json().then(data => {
                    console.error('Ошибка обновления:', data);
                    alert('Ошибка при обновлении пользователя: ' + data.message);
                });
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert('Ошибка при обновлении пользователя: ' + error.message);
        });
});






// Функция для удаления пользователя
function openDeleteUserPopup(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        console.log('Deleting user ID:', userId);
        fetch(`/admin/users/${userId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    fetchUsers();
                    alert('Пользователь успешно удалён!');
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Не удалось удалить пользователя');
                    });
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Ошибка при удалении пользователя: ' + error.message);
            });
    }
}

// Функция для открытия модального окна
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Функция для закрытия модального окна
function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Функция для установки обработчиков закрытия модальных окон
function setupCloseButtons() {
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Закрытие модальных окон при клике на оверлей
    const overlay = document.getElementById('overlay');
    overlay.addEventListener('click', function () {
        const modals = document.querySelectorAll('.popup');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}