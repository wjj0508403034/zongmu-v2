package com.zongmu.gts.algorithm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class MarkTagItem extends EntityModel {

	@ManyToOne
	@JoinColumn(nullable = false)
	private MarkTag markTag;

	@Column
	private String name;

	public MarkTag getMarkTag() {
		return markTag;
	}

	public void setMarkTag(MarkTag markTag) {
		this.markTag = markTag;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
