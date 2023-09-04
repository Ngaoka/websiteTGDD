package com.poly.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.poly.service.OrderService;

@Controller
public class HomeController {
	@Autowired
	 OrderService ordService;
    
    @RequestMapping({"/","/home"})
    public String index() {
        return "product/_list";
    }
    @RequestMapping("/order")
    public String pageOrder(Model model, HttpServletRequest request) {
    	String username = request.getRemoteUser();
    	
		model.addAttribute("userorder", ordService.findByUsername(username));		
        return "layout/_order";
    }
    @RequestMapping("/order/detail/{id}")
	public String detail(Model model, @PathVariable("id") Integer id) {
		model.addAttribute("orderdetail", ordService.findById(id));
		return "layout/_orderdetail";
	}
}
