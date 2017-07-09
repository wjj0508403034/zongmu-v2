package com.zongmu.gts.user.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.zongmu.gts.user.BusinessRole;
import com.zongmu.gts.user.User;

@Repository
public interface UserRepo extends PagingAndSortingRepository<User, Long>, JpaSpecificationExecutor<User> {

	@Query("select t from User t where t.businessRole = ?1 and t.black <> true and t.active = true")
	Page<User> findUsersByBusinessRole(BusinessRole role, Pageable pageable);

	@Query("select t from User t where t.black <> true and t.active = true")
	Page<User> findUsers(Pageable pageable);

	@Query("select t from User t where t.black = true")
	Page<User> findBlackUsers(Pageable pageable);

	@Query("select count(t) > 0 from User t where t.email = ?1")
	boolean exists(String email);

	@Query("select t from User t where t.activeCode = ?1")
	User findUserByActiveCode(String activeCode);
	
	@Query("select t from User t where t.email = ?1")
	User findByEmail(String email);
}
