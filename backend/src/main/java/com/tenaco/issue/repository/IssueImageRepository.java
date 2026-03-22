package com.tenaco.issue.repository;

import com.tenaco.issue.entity.IssueImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface IssueImageRepository extends JpaRepository<IssueImage, UUID> {
}
