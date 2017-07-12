package com.zongmu.gts.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zongmu.gts.core.BusinessException;
import com.zongmu.gts.user.UserService;

@Controller
@RequestMapping
public class LoginController {

	@Autowired
	private UserService userService;

	@RequestMapping(value = "/active.html", method = RequestMethod.GET)
	public String active(@RequestParam(value = "code") String activeCode) {
		try {
			this.userService.activeUser(activeCode);
			return "";
		} catch (BusinessException e) {
			return "";
		}
	}

	@RequestMapping(value = "/login.html", method = RequestMethod.GET)
	public String loginPage() {
		return "login";
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	@ResponseBody
	public void login(@RequestBody LoginParam loginParam)
			throws BusinessException {
		this.userService.login(loginParam);
	}

	@RequestMapping(value = "/register.html", method = RequestMethod.GET)
	public String registerPage() {
		return "register";
	}

	@RequestMapping(value = "/register", method = RequestMethod.POST)
	@ResponseBody
	public void register(@RequestBody RegisterParam registerParam)
			throws BusinessException {
		this.userService.register(registerParam);
	}
}
