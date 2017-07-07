package com.zongmu.gts.asset.repositories;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.zongmu.gts.asset.AssetFile;

@Repository
public interface AssetFileRepo extends PagingAndSortingRepository<AssetFile, Long>, JpaSpecificationExecutor<AssetFile>{

}
