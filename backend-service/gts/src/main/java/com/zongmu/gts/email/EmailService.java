package com.zongmu.gts.email;

import com.zongmu.gts.core.BusinessException;

public interface EmailService {

	void send(String to, EmailTemplate template) throws BusinessException;
}
