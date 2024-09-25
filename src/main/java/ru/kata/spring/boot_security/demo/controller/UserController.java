package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.DetailService;

import java.security.Principal;

@Controller
public class UserController {

    private final DetailService detailService;

    @Autowired
    public UserController(DetailService detailService) {
        this.detailService = detailService;
    }

    @GetMapping(value = "/user")
    public String getUserData(Principal principal, Model model) {
        User user = detailService.findByEmail(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }
}


