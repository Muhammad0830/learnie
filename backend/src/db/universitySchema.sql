-- ================================
-- Default Schema Template
-- Used when registering a new university
-- ================================

-- 1. users
 CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` enum('student','teacher', 'admin', 'superadmin') DEFAULT 'student',
  phoneNumber varchar(255) not null,
  age varchar(255),
  studentId varchar(255) unique,
  created_at datetime default current_timestamp,
  updated_at datetime default null on update current_timestamp,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

-- 2. Courses
create table courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  has_topics BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. refresh Tokens
CREATE TABLE `refresh_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` varchar(1000) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

-- 4. users courses
CREATE TABLE users_courses (
  user_id bigint unsigned NOT NULL,
  course_id int NOT NULL,
  created_at datetime default current_timestamp,
  PRIMARY KEY (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);