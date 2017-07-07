package com.zongmu.gts.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.joda.time.DateTime;

import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class User extends EntityModel {

	@Column
	private String userName;

	@Column
	private String email;

	@Column
	private String phone;

	@Column
	private String password;

	@Column
	private boolean active;

	@Column
	private String activeCode;

	@Column
	private DateTime registerDate;

	@Column
	private String resetPasswordActiveCode;

	@Column
	private DateTime resetPasswordDate;

	@Column
	private boolean resetActive;

	@Column
	private BusinessRole businessRole = BusinessRole.NORMAL;

	@Column
	private String alipayAccount;

	@Column
	private String icon;

	@Column
	private String qq;

	@Column
	private String wechat;

	@Column
	private boolean black;

	@Column
	private boolean locked;

	@Column
	private int loginFailedCount;

	@Column
	private DateTime lockedDate;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getActiveCode() {
		return activeCode;
	}

	public void setActiveCode(String activeCode) {
		this.activeCode = activeCode;
	}

	public DateTime getRegisterDate() {
		return registerDate;
	}

	public void setRegisterDate(DateTime registerDate) {
		this.registerDate = registerDate;
	}

	public String getResetPasswordActiveCode() {
		return resetPasswordActiveCode;
	}

	public void setResetPasswordActiveCode(String resetPasswordActiveCode) {
		this.resetPasswordActiveCode = resetPasswordActiveCode;
	}

	public DateTime getResetPasswordDate() {
		return resetPasswordDate;
	}

	public void setResetPasswordDate(DateTime resetPasswordDate) {
		this.resetPasswordDate = resetPasswordDate;
	}

	public boolean isResetActive() {
		return resetActive;
	}

	public void setResetActive(boolean resetActive) {
		this.resetActive = resetActive;
	}

	public BusinessRole getBusinessRole() {
		return businessRole;
	}

	public void setBusinessRole(BusinessRole businessRole) {
		this.businessRole = businessRole;
	}

	public String getAlipayAccount() {
		return alipayAccount;
	}

	public void setAlipayAccount(String alipayAccount) {
		this.alipayAccount = alipayAccount;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public boolean isBlack() {
		return black;
	}

	public void setBlack(boolean black) {
		this.black = black;
	}

	public boolean isLocked() {
		return locked;
	}

	public void setLocked(boolean locked) {
		this.locked = locked;
	}

	public int getLoginFailedCount() {
		return loginFailedCount;
	}

	public void setLoginFailedCount(int loginFailedCount) {
		this.loginFailedCount = loginFailedCount;
	}

	public DateTime getLockedDate() {
		return lockedDate;
	}

	public void setLockedDate(DateTime lockedDate) {
		this.lockedDate = lockedDate;
	}
}
