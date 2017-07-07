package com.zongmu.gts.asset.repositories;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.zongmu.gts.asset.AssetTag;
import com.zongmu.gts.asset.AssetTagItem;

@Repository
public interface AssetTagItemRepo extends PagingAndSortingRepository<AssetTagItem, Long>, JpaSpecificationExecutor<AssetTagItem>{

	@Query("select count(t) > 0 from AssetTagItem t where t.assetTag = ?1 and t.name = ?2")
	boolean exists(AssetTag assetTag,String name);
}
