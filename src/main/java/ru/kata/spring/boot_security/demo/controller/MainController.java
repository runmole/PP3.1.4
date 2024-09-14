package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;

@Controller
public class MainController {

    @GetMapping(value = "/")
    public String redirectToLogin() {
        return "redirect:/login";
    }

}
