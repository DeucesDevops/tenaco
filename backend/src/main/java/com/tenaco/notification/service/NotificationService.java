package com.tenaco.notification.service;

import com.tenaco.issue.entity.Issue;
import com.tenaco.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@tenaco.com}")
    private String fromAddress;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void notifyNewIssue(Issue issue) {
        User landlord = issue.getProperty().getLandlord();
        String subject = "New Issue: " + issue.getTitle();
        String body = String.format(
                "A new maintenance issue has been reported.\n\n" +
                "Property: %s\n" +
                "Title: %s\n" +
                "Priority: %s\n" +
                "Description: %s\n\n" +
                "Reported by: %s\n\n" +
                "Log in to Tenaco to view and manage this issue.",
                issue.getProperty().getName(),
                issue.getTitle(),
                issue.getPriority().name(),
                issue.getDescription(),
                issue.getTenant().getName()
        );
        sendEmail(landlord.getEmail(), subject, body);
    }

    @Async
    public void notifyStatusUpdate(Issue issue) {
        User tenant = issue.getTenant();
        String subject = "Issue Update: " + issue.getTitle();
        String body = String.format(
                "Your maintenance issue has been updated.\n\n" +
                "Property: %s\n" +
                "Title: %s\n" +
                "New Status: %s\n\n" +
                "Log in to Tenaco to view the details.",
                issue.getProperty().getName(),
                issue.getTitle(),
                issue.getStatus().name().replace("_", " ")
        );
        sendEmail(tenant.getEmail(), subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent to {} — subject: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {} — {}", to, e.getMessage());
        }
    }
}
