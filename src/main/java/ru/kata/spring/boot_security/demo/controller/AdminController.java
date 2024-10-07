package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositoies.RoleRepository;
import ru.kata.spring.boot_security.demo.repositoies.UserRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.*;


@Controller
public class AdminController {
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Autowired
    public AdminController(UserService userService, RoleRepository roleRepository, UserRepository userRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping(value = "/admin")
    public String getAllUsers(Model model, Principal principal) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("user", userRepository.findByEmail(principal.getName()));
        model.addAttribute("users", users);
        return "admin";
    }

    @PostMapping("/admin/addUser")
    public String addUser(@ModelAttribute User user, @RequestParam("roles") List<Long> roleIds) {
            Set<Role> roles = new HashSet<>();
            for (Long roleId : roleIds) {
                roleRepository.findById(roleId).ifPresent(roles::add);
            }
            user.setRoles(roles);
            userService.addUser(user);
            return "redirect:/admin";
        }

    @PostMapping("/admin/deleteUser")
    public String deleteUser(@RequestParam Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @PostMapping("/admin/updateUser")
    public String updateUser(@ModelAttribute User user, @RequestParam("roles") List<Long> roleIds) {
        Set<Role> roles = new HashSet<>();
        for (Long roleId : roleIds) {
            roleRepository.findById(roleId).ifPresent(roles::add);
        }
        user.setRoles(roles);
        userService.updateUser(user);
        return "redirect:/admin";
    }
}
