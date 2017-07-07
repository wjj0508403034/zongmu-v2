package com.zongmu.gts.algorithm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zongmu.gts.core.EntityModel;

@Entity
@Table(indexes = {
		@Index(name = "COLOR_GROUP_ITEM_NAME_UNIQUE_INDEX", columnList = "color_group_id,name", unique = true) })
public class ColorGroupItem extends EntityModel {

	@Column
	private String name;

	@Column
	private String color;

	@ManyToOne
	@JoinColumn(nullable = false)
	private ColorGroup colorGroup;

	public String getName() {
		return name;
	}

	public String getColor() {
		return color;
	}

	public ColorGroup getColorGroup() {
		return colorGroup;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public void setColorGroup(ColorGroup colorGroup) {
		this.colorGroup = colorGroup;
	}
}
