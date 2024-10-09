package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.DetailService;
import java.security.Principal;


@RestController
@RequestMapping("/api")
public class UserController {
    private DetailService detailService;

    @Autowired
    public UserController(DetailService detailService) {
        this.detailService = detailService;
    }

    @GetMapping(value = "/user")
    public User getCurrentUser(Principal principal) {
        return detailService.findByEmail(principal.getName());
    }
}
