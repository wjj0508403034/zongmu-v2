package com.zongmu.gts.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import com.zongmu.gts.core.BusinessException;

@Controller
@RequestMapping
public class ApplicationController {

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String root() throws BusinessException {
		return "redirect:/index.html";
	}

	@RequestMapping(value = "/index.html", method = RequestMethod.GET)
	public String index() throws BusinessException {
		return "index";
	}
	
	@RequestMapping(value = "/test.html", method = RequestMethod.GET)
	public String test() throws BusinessException {
		return "test";
	}
}
