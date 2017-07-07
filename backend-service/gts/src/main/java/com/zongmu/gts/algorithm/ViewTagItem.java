package com.zongmu.gts.algorithm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class ViewTagItem extends EntityModel {

	@ManyToOne
	@JoinColumn(nullable = false)
	private ViewTag viewTag;

	@Column
	private String name;

	public ViewTag getViewTag() {
		return viewTag;
	}

	public void setViewTag(ViewTag viewTag) {
		this.viewTag = viewTag;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
