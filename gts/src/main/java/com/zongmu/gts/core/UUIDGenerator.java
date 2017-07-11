package com.zongmu.gts.core;

import java.util.Random;

import org.joda.time.DateTime;
import org.springframework.stereotype.Service;

@Service
public class UUIDGenerator {

	private Random random = new Random();
	private static int MAX = 9999;
	private static int MIN = 1000;

	public String generateNo() {
		return DateTime.now().toString("yyyyMMddHHmmssSSS") + randomNum();
	}

	private int randomNum() {
		return this.random.nextInt(MAX) % (MAX - MIN + 1) + MIN;
	}
}
