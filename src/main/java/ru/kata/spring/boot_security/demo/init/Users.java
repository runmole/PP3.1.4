package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositoies.RoleRepository;
import ru.kata.spring.boot_security.demo.repositoies.UserRepository;

import javax.annotation.PostConstruct;
import java.util.Set;

@Component
public class Users {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public Users(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        Role adminRole = new Role();
        adminRole.setRole("ROLE_ADMIN");
        roleRepository.save(adminRole);

        Role userRole = new Role();
        userRole.setRole("ROLE_USER");
        roleRepository.save(userRole);

        User admin = new User();
        admin.setEmail("admin@mail.ru");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRoles(Set.of(adminRole, userRole));
        admin.setAge(33);
        admin.setFirstName("Kata");
        admin.setLastName("Mentor");
        userRepository.save(admin);

        User user = new User();
        user.setEmail("user@mail.ru");
        user.setPassword(passwordEncoder.encode("user"));
        user.setRoles(Set.of(userRole));
        user.setAge(25);
        user.setFirstName("Dimka");
        user.setLastName("Nosov");
        userRepository.save(user);
    }
}

