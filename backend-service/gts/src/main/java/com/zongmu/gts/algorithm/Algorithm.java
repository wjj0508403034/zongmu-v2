package com.zongmu.gts.algorithm;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class Algorithm extends EntityModel {

	@Column
	private String name;

	@OneToOne(mappedBy = "algorithm", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@OrderBy("id ASC")
	private ColorGroup colorGroup;

	@OneToMany(mappedBy = "algorithm", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@OrderBy("id ASC")
	private final List<ViewTag> viewTags = new ArrayList<>();

	@OneToMany(mappedBy = "algorithm", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@OrderBy("id ASC")
	private final List<MarkTag> markTags = new ArrayList<>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ColorGroup getColorGroup() {
		return colorGroup;
	}

	public void setColorGroup(ColorGroup colorGroup) {
		this.colorGroup = colorGroup;
	}

	public List<ViewTag> getViewTags() {
		return viewTags;
	}

	public List<MarkTag> getMarkTags() {
		return markTags;
	}
}
