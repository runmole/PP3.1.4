document.addEventListener("DOMContentLoaded", function () {
    fetchCurrentUser();
    fetchAllUsers();

});

function fetchCurrentUser() {
    fetch('/api/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить пользователя');
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
                throw new Error('Не удалось получить пользователей');
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
                    
                    <td><button class="btn btn-info text-white" onclick="openEditModel(${user.id})">Edit</button></td>
                    <td><button class="btn btn-danger" onclick="openDeleteModal(${user.id})">Delete</button></td>
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
                window.location.href = '/admin';

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

// РЕДАКТИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ \\

function openEditModel(userId) {
    console.log('Открытие модального окна редактирования для пользователя ID:', userId);
    fetch(`api/admin/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить пользователя для редактирования');
            }
            return response.json();
        })
        .then(user => {
            console.log('Пользователь загружен для редактирования:', user);
            document.getElementById('id').value = user.id;
            document.getElementById('firstNameEdit').value = user.firstName;
            document.getElementById('lastNameEdit').value = user.lastName;
            document.getElementById('ageEdit').value = user.age;
            document.getElementById('emailEdit').value = user.email;

            const editRolesSelect = document.getElementById('rolesEdit');
            Array.from(editRolesSelect.options).forEach(option => {
                option.selected = user.roles.some(role => role.id === parseInt(option.value, 10));
            });

            openModal('editUserModal');
        })
        .catch(error => console.error('Ошибка:', error));
}

document.getElementById('editUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const userId = document.getElementById('id').value;
    const user = {
        id: userId,
        firstName: formData.get('firstNameEdit'),
        lastName: formData.get('lastNameEdit'),
        age: parseInt(formData.get('ageEdit'), 10),
        email: formData.get('emailEdit'),
        password: formData.get('passwordEdit'),
        roles: Array.from(document.getElementById('rolesEdit').selectedOptions).map(option => ({
            id: parseInt(option.value, 10)
        }))
    };
    console.log('Updating user:', user);
    fetch(`api/admin/updateUser`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось обновить пользователя');
            }
            return response.json();
        })
        .then(updatedUser => {
            console.log('Пользователь успешно обновлен:', updatedUser);
            fetchAllUsers();
            fetchCurrentUser();
            $('#editUserModal').modal('hide');
            document.body.style.overflow = '';
        })
        .catch(error => {
            console.error('Ошибка при обновлении пользователя:', error);
            alert('Ошибка при обновлении пользователя: ' + error.message);
        });
});


// УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ \\

function openDeleteModal(userId) {

    console.log('Открытие модального окна удаления пользователя по ID:', userId);
    fetch(`api/admin/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить пользователя для редактирования');
            }
            return response.json();
        })
        .then(user => {
            console.log('Пользователь загружен для редактирования:', user);
            document.getElementById('idDelete').value = user.id;
            document.getElementById('firstNameDelete').value = user.firstName;
            document.getElementById('lastNameDelete').value = user.lastName;
            document.getElementById('ageDelete').value = user.age;
            document.getElementById('emailDelete').value = user.email;

            openModal('deleteUserModal');

            document.getElementById('confirmDeleteButton').onclick = function () {
                deleteUser(user.id);
            };
        })
        .catch(error => console.error('Ошибка:', error));
}

function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        fetch(`/api/admin/deleteUser/${userId}`, {
            method: 'DELETE'
        })
            .then(response => {
                console.log('Ответ от сервера:', response);
                if (!response.ok) {
                    throw new Error('Не удалось удалить пользователя');
                }
                console.log('Пользователь успешно удален');
                fetchAllUsers();
                fetchCurrentUser();
                $('#deleteUserModal').modal('hide');
            })

    }
}


// ОТКРЫТИЕ МОДАЛЬНОГО ОКНА \\

function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}