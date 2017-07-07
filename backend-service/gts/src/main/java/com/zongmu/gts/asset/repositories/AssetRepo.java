package com.zongmu.gts.asset.repositories;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.zongmu.gts.asset.Asset;

@Repository
public interface AssetRepo extends PagingAndSortingRepository<Asset, Long>, JpaSpecificationExecutor<Asset>{

	@Query("select t from Asset t where t.assetNo = ?1")
	Asset findByAssetNo(String assetNo);
}
