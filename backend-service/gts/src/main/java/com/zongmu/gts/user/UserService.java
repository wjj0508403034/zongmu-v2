package com.zongmu.gts.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.zongmu.gts.core.BusinessException;
import com.zongmu.gts.user.controller.LoginParam;
import com.zongmu.gts.user.controller.RegisterParam;
import com.zongmu.gts.user.controller.UserProfileParam;

public interface UserService {

	Page<User> findUsersByBusinessRole(Pageable pageable, BusinessRole role) throws BusinessException;

	Page<User> findBlackUsers(Pageable pageable) throws BusinessException;

	void setUserInBlackList(Long userId) throws BusinessException;

	void setUserBackFromBalckList(Long userId) throws BusinessException;

	User findUser(Long userId) throws BusinessException;

	void changeUserRole(Long userId, BusinessRole role) throws BusinessException;

	void register(RegisterParam registerParam) throws BusinessException;

	void activeUser(String activeCode) throws BusinessException;

	void login(LoginParam loginParam) throws BusinessException;

	User getCurrentUser() throws BusinessException;

	void updateUserProfile(UserProfileParam userProfileParam) throws BusinessException;

}
