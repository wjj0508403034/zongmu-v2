package com.zongmu.gts.user.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.zongmu.gts.user.User;
import com.zongmu.gts.user.UserInfo;
import com.zongmu.gts.user.UserService;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	
	@Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByEmail(username);
        if (user == null) {
			throw new UsernameNotFoundException(String.format("User with email=%s was not found", username));
		}
        return new UserInfo(user);
    }
}
