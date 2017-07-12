package com.zongmu.gts.user.impl;

import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.zongmu.gts.core.BusinessException;
import com.zongmu.gts.core.ErrorCode;
import com.zongmu.gts.email.EmailService;
import com.zongmu.gts.email.EmailTemplate;
import com.zongmu.gts.email.EmailTemplateNames;
import com.zongmu.gts.email.impl.EmailTemplateImpl;
import com.zongmu.gts.user.BusinessRole;
import com.zongmu.gts.user.User;
import com.zongmu.gts.user.UserInfo;
import com.zongmu.gts.user.UserService;
import com.zongmu.gts.user.controller.LoginParam;
import com.zongmu.gts.user.controller.RegisterParam;
import com.zongmu.gts.user.controller.UserProfileParam;
import com.zongmu.gts.user.repositories.UserRepo;

@Service
public class UserServiceImpl implements UserService {

	private final static Logger LOGGER = LoggerFactory
			.getLogger(UserServiceImpl.class);

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private EmailService emailService;

	@Autowired
	// @Qualifier("org.springframework.security.authenticationManager")
	private AuthenticationManager authenticationManager;

	@Override
	public Page<User> findUsersByBusinessRole(Pageable pageable,
			BusinessRole role) {
		if (role == null) {
			return this.userRepo.findUsers(pageable);
		}

		return this.userRepo.findUsersByBusinessRole(role, pageable);
	}

	@Override
	public Page<User> findBlackUsers(Pageable pageable) {
		return this.userRepo.findBlackUsers(pageable);
	}

	@Override
	public void setUserInBlackList(Long userId) throws BusinessException {
		User user = this.findUser(userId);
		user.setBlack(true);
		this.userRepo.save(user);
	}

	@Override
	public void setUserBackFromBalckList(Long userId) throws BusinessException {
		User user = this.findUser(userId);
		user.setBlack(false);
		this.userRepo.save(user);
	}

	@Override
	public User findUser(Long userId) throws BusinessException {
		User user = this.userRepo.findOne(userId);
		if (user == null) {
			LOGGER.error("User {} not exists.", userId);
			throw new BusinessException(ErrorCode.USER_NOT_EXIST);
		}

		return user;

	}

	@Override
	public void changeUserRole(Long userId, BusinessRole role)
			throws BusinessException {
		if (role == null) {
			LOGGER.error("Business role should not be null.");
			throw new BusinessException(ErrorCode.USER_BUSINESS_ROLE_IS_NULL);
		}
		User user = this.findUser(userId);
		user.setBusinessRole(role);
		this.userRepo.save(user);
	}

	@Override
	public User getCurrentUser() throws BusinessException {
		User user = this.getCurrentUserFromAuthentication();
		if (user == null) {
			throw new BusinessException(ErrorCode.USER_NOT_LOGGIN);
		}

		return this.userRepo.findOne(user.getId());
	}

	@Override
	public void updateUserProfile(UserProfileParam userProfileParam)
			throws BusinessException {
		User user = this.getCurrentUser();
		user.setUserName(userProfileParam.getUserName());
		user.setSex(userProfileParam.getSex());
		user.setPhone(userProfileParam.getPhone());
		user.setAlipayAccount(userProfileParam.getAlipayAccount());
		user.setQq(userProfileParam.getQq());
		user.setWechat(userProfileParam.getWechat());
		this.userRepo.save(user);
	}

	@Transactional
	@Override
	public void register(RegisterParam registerParam) throws BusinessException {
		LOGGER.info("User {} register ...", registerParam.getEmail());
		registerParam.onValid();

		boolean exist = this.userRepo.exists(registerParam.getEmail());
		if (exist) {
			throw new BusinessException(ErrorCode.USER_EXIST);
		}

		User user = new User();
		user.setEmail(registerParam.getEmail());
		user.setPassword(registerParam.getPassword());
		user.setActiveCode(UUID.randomUUID().toString());
		user.setRegisterDate(DateTime.now());
		this.userRepo.save(user);
		//this.sendRegisterMail(user);
	}

	@Override
	public void activeUser(String activeCode) throws BusinessException {
		User user = this.userRepo.findUserByActiveCode(activeCode);
		if (user == null) {
			throw new BusinessException(ErrorCode.USER_NOT_EXIST);
		}

		if (user.isActive()) {
			throw new BusinessException(ErrorCode.USER_IS_ACTIVE);
		}

		if (user.getRegisterDate().plusDays(1).isBeforeNow()) {
			throw new BusinessException(ErrorCode.ACTIVE_DATA_IS_OVERDUE);
		}
		user.setActive(true);
		this.userRepo.save(user);
	}

	@Override
	public User findByEmail(String email) {
		return this.userRepo.findByEmail(email);
	}

	@Override
	public void login(LoginParam loginParam) throws BusinessException {
		User user = this.userRepo.findByEmail(loginParam.getEmail());
		if (user == null) {
			throw new BusinessException(ErrorCode.USER_NOT_EXIST);
		}

		if (!user.isActive()) {
			throw new BusinessException(ErrorCode.USER_IS_NOT_ACTIVE);
		}

		if (user.isBlack()) {
			throw new BusinessException(ErrorCode.LOGIN_USER_IS_BLACK);
		}

		if (user.isLocked()) {
			if (user.getLockedDate().plusHours(12).isAfter(DateTime.now())) {
				throw new BusinessException(ErrorCode.LOGIN_USER_IS_LOCKEZD);
			} else {
				user.setLocked(false);
				user.setLoginFailedCount(0);
				this.userRepo.save(user);
			}
		}

		if (!StringUtils.equals(user.getPassword(), loginParam.getPassword())) {
			user.setLoginFailedCount(user.getLoginFailedCount() + 1);
			if (user.getLoginFailedCount() >= 5) {
				user.setLocked(true);
				user.setLockedDate(DateTime.now());
			}
			this.userRepo.save(user);
		} else {
			user.setLocked(false);
			user.setLoginFailedCount(0);
			this.userRepo.save(user);
		}
		this.autoLogin(user);
	}

	private void autoLogin(User user) {
		UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
				user.getEmail(), user.getPassword());

		authenticationManager.authenticate(usernamePasswordAuthenticationToken);
		SecurityContextHolder.getContext().setAuthentication(
				usernamePasswordAuthenticationToken);
		LOGGER.info("User {} login successfully", user.getEmail());
	}

	private User getCurrentUserFromAuthentication() {
		Authentication authentication = SecurityContextHolder.getContext()
				.getAuthentication();
		if (authentication != null && authentication.getPrincipal() != null) {
			UserInfo userInfo = (UserInfo) authentication.getPrincipal();
			if (userInfo != null) {
				return userInfo.getUser();
			}
		}

		return null;
	}

	private void sendRegisterMail(User user) throws BusinessException {
		EmailTemplate emailTemplate = new EmailTemplateImpl(
				EmailTemplateNames.User_Active);
		emailTemplate.setVariable("user", user);
		emailTemplate.setVariable("link", "http://www.baidu.com");
		this.emailService.send(user.getEmail(), emailTemplate);
	}

}
