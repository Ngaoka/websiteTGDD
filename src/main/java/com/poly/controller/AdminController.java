package com.poly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.poly.entity.Order;
import com.poly.service.AccountService;
import com.poly.service.OrderService;

@Controller
public class AdminController {
	@Autowired
	OrderService ordService;
	
	@Autowired
	AccountService accService;
	
	@ModelAttribute("orders")
	public List<Order> getOrder() {
		return ordService.findAll();
	}
	
	  @RequestMapping("/admin/account")
	    public String index1() {
	        return "admin/_account";
	    }
	  @RequestMapping("/admin/category")
	    public String index2() {
	        return "admin/_category";
	    }
	  @RequestMapping("/admin/product")
	    public String index3() {
	        return "admin/_adproduct";
	    }
	  @RequestMapping("/admin/order")
	    public String index4() {
	        return "admin/_order";
	    }
		@RequestMapping("/admin/order/detail/{id}")
		public String detail(Model model, @PathVariable("id") Integer id) {
			model.addAttribute("order", ordService.findById(id));
			return "admin/_order-detail";
		}
		
		@RequestMapping({ "admin", "admin/dashboard" })
		public String detail(Model model) {
			model.addAttribute("acc", accService.findAll().size());
			model.addAttribute("total", ordService.getTotal());
			model.addAttribute("order", ordService.findAll().size());
			model.addAttribute("orders",ordService.findAll() );
			return "admin/_dashboard";
		}
}
