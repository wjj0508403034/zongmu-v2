package com.zongmu.gts.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zongmu.gts.core.BusinessException;
import com.zongmu.gts.user.BusinessRole;
import com.zongmu.gts.user.User;
import com.zongmu.gts.user.UserService;

@Controller
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService userService;

	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public Page<User> getUserList(
			@RequestParam(value = "pageIndex", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize,
			@RequestParam(value = "role", required = false) BusinessRole role) throws BusinessException {
		Pageable pageable = new PageRequest(pageIndex, pageSize);
		return this.userService.findUsersByBusinessRole(pageable, role);
	}

	@RequestMapping(value = "/{userId}", method = RequestMethod.GET)
	@ResponseBody
	public User getUser(@PathVariable("userId") Long userId) throws BusinessException {
		return this.userService.findUser(userId);
	}

	@RequestMapping(value = "/{userId}/changeRole", method = RequestMethod.POST)
	@ResponseBody
	public void setUserRole(@PathVariable("userId") Long userId, @RequestBody BusinessRole role)
			throws BusinessException {
		this.userService.changeUserRole(userId, role);
	}

	@RequestMapping(value = "/black", method = RequestMethod.GET)
	@ResponseBody
	public Page<User> getBlackUserList(
			@RequestParam(value = "pageIndex", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize)
			throws BusinessException {
		Pageable pageable = new PageRequest(pageIndex, pageSize);
		return this.userService.findBlackUsers(pageable);
	}

	@RequestMapping(value = "/{userId}/addBlack", method = RequestMethod.POST)
	@ResponseBody
	public void addBlackList(@PathVariable("userId") Long userId) throws BusinessException {
		this.userService.setUserInBlackList(userId);
	}

	@RequestMapping(value = "/{userId}/removeBlack", method = RequestMethod.POST)
	@ResponseBody
	public void removeBlackList(@PathVariable("userId") Long userId) throws BusinessException {
		this.userService.setUserBackFromBalckList(userId);
	}
	
	@RequestMapping(value = "/profile", method = RequestMethod.POST)
	@ResponseBody
	public void updateUserProfile(@RequestBody UserProfileParam userProfileParam) throws BusinessException {
		this.userService.updateUserProfile(userProfileParam);
	}

	@RequestMapping(value = "/profile", method = RequestMethod.GET)
	@ResponseBody
	public User myProfile() throws BusinessException {
		return this.userService.getCurrentUser();
	}

}
