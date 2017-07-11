package com.zongmu.gts.algorithm;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class ColorGroup extends EntityModel {

	@Column
	private String name;

	@OneToOne
	@JoinColumn(nullable = false)
	private Algorithm algorithm;

	@OneToMany(mappedBy = "colorGroup", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@OrderBy("id ASC")
	private final List<ColorGroupItem> items = new ArrayList<>();

	public String getName() {
		return name;
	}

	public List<ColorGroupItem> getItems() {
		return items;
	}

	public void setName(String name) {
		this.name = name;
	}

	@JsonIgnore
	public Algorithm getAlgorithm() {
		return algorithm;
	}

	public void setAlgorithm(Algorithm algorithm) {
		this.algorithm = algorithm;
	}

}
