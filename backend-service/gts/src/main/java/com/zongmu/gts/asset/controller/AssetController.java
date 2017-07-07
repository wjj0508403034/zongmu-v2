package com.zongmu.gts.asset.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zongmu.gts.asset.Asset;
import com.zongmu.gts.asset.AssetFile;
import com.zongmu.gts.asset.AssetService;
import com.zongmu.gts.asset.AssetTag;
import com.zongmu.gts.core.BusinessException;

@Controller
@RequestMapping("/assets")
public class AssetController {

	@Autowired
	private AssetService assetService;

	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public List<Asset> query() {
		return this.assetService.query();
	}

	@RequestMapping(method = RequestMethod.POST)
	@ResponseBody
	public Asset create(@RequestBody CreateAssetParam createAssetParam) throws BusinessException {
		return this.assetService.save(createAssetParam);
	}

	@RequestMapping(value = "/{assetNo}/files", method = RequestMethod.POST)
	@ResponseBody
	public AssetFile createAssetFile(@PathVariable("assetNo") String assetNo,
			@RequestBody AssetFile assetFile) throws BusinessException {
		return this.assetService.attchFile(assetNo, assetFile);
	}
	
	@RequestMapping(value = "/tags", method = RequestMethod.GET)
	@ResponseBody
	public List<AssetTag> findAllTags()
			throws BusinessException {
		return this.assetService.findAllTags();
	}

	@RequestMapping(value = "/tags", method = RequestMethod.POST)
	@ResponseBody
	public AssetTag createTag(@RequestBody AssetTag assetTag)
			throws BusinessException {
		return this.assetService.createTag(assetTag);
	}
	
	@RequestMapping(value = "/tags/{assetTagId}/batchAdd", method = RequestMethod.POST)
	@ResponseBody
	public AssetTag batchAddTagItems(@PathVariable("assetTagId") Long assetTagId,@RequestBody List<String> tagItems)
			throws BusinessException {
		return this.assetService.batchAddTagItems(assetTagId,tagItems);
	}
}
