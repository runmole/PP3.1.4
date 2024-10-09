document.addEventListener("DOMContentLoaded", function () {
    fetchCurrentUser();
});

function fetchCurrentUser() {
    fetch('/api/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Oshibka kakaya-to hz');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            document.getElementById('navbarEmail').textContent = data.email;
            document.getElementById('navbarRoles').textContent = data.roles.map(role => role.role.replace('ROLE_', '')).join(', ');

            document.getElementById('id').textContent = data.id;
            document.getElementById('firstName').textContent = data.firstName;
            document.getElementById('lastName').textContent = data.lastName;
            document.getElementById('age').textContent = data.age;
            document.getElementById('email').textContent = data.email;
            document.getElementById('roles').textContent = data.roles.map(role => role.role.replace('ROLE_', '')).join(', ');
        })
        .catch(error => {
            console.error('Oshibka fetchinga: ', error);
        });
}