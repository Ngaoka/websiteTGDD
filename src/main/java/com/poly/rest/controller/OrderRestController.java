package com.poly.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.dto.OrderDTO;
import com.poly.dto.ProductDTO;
import com.poly.entity.Order;
import com.poly.entity.Product;
import com.poly.service.OrderService;


@CrossOrigin("*")
@RestController
@RequestMapping("/rest/orders")
public class OrderRestController {
    @Autowired
    OrderService orderService;
	
	
	@PostMapping
	public Order purchase(@RequestBody JsonNode orderData) {	   
	    return orderService.create(orderData);			
	}
	
	/*
	 * @GetMapping("/list") public List<Order> getAllProducts() { return
	 * orderService.findAll(); }
	 */
	
	@GetMapping("{id}")
	public Order getOne(@PathVariable("id") Integer id) {
		return orderService.findById(id);
	}
	
	
	@PutMapping("{id}")
	public Order updateOrder(@PathVariable("id") Integer id,@RequestBody Order Order) {
	   return orderService.save(Order);
	}
	
	
	
	
}
