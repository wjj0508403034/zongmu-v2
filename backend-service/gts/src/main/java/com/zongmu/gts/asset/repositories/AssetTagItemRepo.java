package com.zongmu.gts.asset.repositories;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.zongmu.gts.asset.AssetTag;
import com.zongmu.gts.asset.AssetTagItem;

@Repository
public interface AssetTagItemRepo
		extends PagingAndSortingRepository<AssetTagItem, Long>, JpaSpecificationExecutor<AssetTagItem> {

	@Query("select count(t) > 0 from AssetTagItem t where t.assetTag = ?1 and t.name = ?2")
	boolean exists(AssetTag assetTag, String name);

	@Modifying
	@Query("update AssetTagItem t set t.isDefault = true where t.assetTag = ?1 and t.id = ?2")
	void setTagItemDefault(AssetTag assetTag, Long id);

	@Modifying
	@Query("update AssetTagItem t set t.isDefault = true where t.assetTag = ?1 and t.id <> ?2")
	void setOtherTagItemsDefault(AssetTag assetTag, Long id);
	
	@Query("select count(t) > 0 from AssetTagItem t where t.assetTag = ?1")
	boolean hasDefaultTagItem(AssetTag assetTag);

	@Modifying
	@Query(value = "UPDATE asset_tag_item SET is_default = 1 where asset_tag_id = ?1 ORDER BY id LIMIT 1", nativeQuery = true)
	void setFirstTagItemDefault(Long assetTagId);
}
