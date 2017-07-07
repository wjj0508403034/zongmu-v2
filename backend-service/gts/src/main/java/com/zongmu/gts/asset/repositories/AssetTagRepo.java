package com.zongmu.gts.asset.repositories;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.zongmu.gts.asset.AssetTag;

@Repository
public interface AssetTagRepo extends PagingAndSortingRepository<AssetTag, Long>, JpaSpecificationExecutor<AssetTag>{

}
