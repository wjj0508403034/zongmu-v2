package com.zongmu.gts.algorithm;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class ViewTag extends EntityModel {
	@ManyToOne
	@JoinColumn(nullable = false)
	private Algorithm algorithm;

	@Column
	private String name;

	@OneToMany(mappedBy = "viewTag", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@OrderBy("id ASC")
	private final List<ViewTagItem> items = new ArrayList<>();

	public Algorithm getAlgorithm() {
		return algorithm;
	}

	public void setAlgorithm(Algorithm algorithm) {
		this.algorithm = algorithm;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<ViewTagItem> getItems() {
		return items;
	}
}
