-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 23, 2025 at 11:04 AM
-- Server version: 8.0.39
-- PHP Version: 8.2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `job_search_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) COLLATE utf8mb4_general_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `job_id`, `applied_at`, `status`) VALUES
(1, 3, 1, '2025-03-22 13:18:02', 'pending'),
(2, 5, 2, '2025-03-22 13:25:36', 'pending'),
(3, 9, 1, '2025-03-22 17:37:30', 'pending'),
(4, 9, 2, '2025-03-22 17:37:40', 'pending'),
(5, 9, 3, '2025-03-22 17:38:12', 'pending'),
(6, 11, 6, '2025-03-22 17:40:17', 'pending'),
(7, 9, 2, '2025-03-22 17:41:34', 'pending'),
(8, 11, 3, '2025-03-22 17:43:37', 'pending'),
(9, 11, 6, '2025-03-22 18:39:58', 'pending'),
(10, 11, 6, '2025-03-22 18:40:11', 'pending'),
(11, 11, 1, '2025-03-22 18:43:41', 'pending'),
(12, 11, 2, '2025-03-22 18:44:15', 'pending'),
(13, 13, 8, '2025-03-22 19:12:48', 'accepted'),
(14, 13, 9, '2025-03-22 19:21:17', 'accepted'),
(15, 13, 10, '2025-03-22 19:45:13', 'pending'),
(16, 13, 10, '2025-03-22 20:03:01', 'pending'),
(17, 13, 10, '2025-03-22 20:03:27', 'pending'),
(18, 15, 12, '2025-03-22 20:09:19', 'rejected'),
(19, 15, 13, '2025-03-22 20:21:24', 'accepted'),
(20, 15, 1, '2025-03-22 20:26:46', 'pending'),
(21, 13, 6, '2025-03-23 08:34:09', 'pending'),
(22, 13, 6, '2025-03-23 08:34:15', 'pending'),
(23, 13, 8, '2025-03-23 08:40:21', 'pending'),
(24, 13, 8, '2025-03-23 08:40:24', 'pending'),
(25, 13, 12, '2025-03-23 08:40:47', 'pending'),
(26, 13, 8, '2025-03-23 08:47:14', 'pending'),
(27, 13, 1, '2025-03-23 08:47:31', 'pending'),
(28, 13, 11, '2025-03-23 09:02:45', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `company` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `salary_range` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `job_type` enum('full-time','part-time','remote') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `requirements` text COLLATE utf8mb4_general_ci,
  `user_id` int DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_general_ci DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `title`, `company`, `location`, `category`, `salary_range`, `job_type`, `description`, `created_at`, `requirements`, `user_id`, `status`) VALUES
(1, 'Frontend Developer', 'TechCorp', 'Remote', 'Technology', '$70k-$90k', 'remote', 'Build amazing UIs.', '2025-03-22 11:43:26', 'Bachelor’s degree in Computer Science, 3+ years of experience, proficiency in React and Node.js', NULL, 'active'),
(2, 'Marketing Manager', 'GrowEasy', 'New York', 'Marketing', '$60k-$80k', 'full-time', 'Lead marketing campaigns.', '2025-03-22 11:43:26', NULL, NULL, 'active'),
(3, 'Graphic Designer', 'CreativeLabs', 'San Francisco', 'Design', '$50k-$70k', 'part-time', 'Create stunning visuals.', '2025-03-22 11:43:26', NULL, NULL, 'active'),
(4, 'booza', 'zxc', 'xcx', 'Technology', '$40-50', 'full-time', 'sdfg', '2025-03-22 13:23:59', 'dfg', NULL, 'active'),
(5, 'kombolcha ', 'c@gmail.com', 'komblcha', 'Design', '$40-50', 'part-time', 'xcv', '2025-03-22 17:17:48', 'xc', 8, 'inactive'),
(6, 'xcv', 'rr@gmail.com', 'xcv', 'Technology', 'xcv', 'full-time', 'xcv', '2025-03-22 17:39:05', 'xcv', 10, 'active'),
(7, 'zxxc', 'c@gmail.com', 'vb', 'Technology', 'dfgb', 'full-time', 'cv', '2025-03-22 19:07:08', 'cv', 8, 'active'),
(8, 'bozaa', 'boza@gmail.com', 'boza', 'Marketing', '$40-50', 'full-time', 'boza', '2025-03-22 19:11:55', 'boza', 12, 'active'),
(9, 'ansif', 'boza@gmail.com', 'ansif', 'Marketing', '$40-50', 'full-time', 'qwe', '2025-03-22 19:20:46', 'sdf', 12, 'inactive'),
(10, 'ansu', 'boza@gmail.com', 'cvb', 'Technology', '$40-50', 'full-time', 'asdf', '2025-03-22 19:44:42', 'dfv', 12, 'active'),
(11, 'Z', 'boza@gmail.com', 'Z', 'Technology', 'z', 'full-time', 'z', '2025-03-22 19:49:44', 'z', 12, 'active'),
(12, 'student', 'b@gmail.com', 'adama', 'Technology', '40-60', 'part-time', 'job', '2025-03-22 20:07:36', 'job', 14, 'active'),
(13, 'dddd', 'b@gmail.com', 'ddd', 'Technology', '40-60', 'part-time', 'ddd', '2025-03-22 20:20:59', 'ddd', 14, 'inactive'),
(14, 'q', 'q@gmail.com', 'adama', 'Technology', '$40-50', 'full-time', 'q', '2025-03-23 07:38:13', 'q', 19, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `user_id` int NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `skills` text COLLATE utf8mb4_general_ci,
  `experience` text COLLATE utf8mb4_general_ci,
  `contact_info` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resume_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`user_id`, `full_name`, `skills`, `experience`, `contact_info`, `created_at`, `updated_at`, `resume_path`) VALUES
(13, 'ansif', 'javscript', '2-5', '0932367491', '2025-03-22 19:43:55', '2025-03-22 19:43:55', NULL),
(15, 'bizualem abebe', 'javascript', 'two years', '0932367491', '2025-03-22 20:09:09', '2025-03-22 20:09:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `saved_jobs`
--

INSERT INTO `saved_jobs` (`id`, `user_id`, `job_id`, `saved_at`) VALUES
(1, 3, 1, '2025-03-22 13:17:56'),
(2, 5, 4, '2025-03-22 13:25:50'),
(3, 9, 2, '2025-03-22 17:37:44'),
(4, 9, 3, '2025-03-22 17:38:07'),
(5, 9, 2, '2025-03-22 17:41:41'),
(7, 11, 1, '2025-03-22 18:40:15'),
(9, 16, 12, '2025-03-23 07:35:27'),
(10, 13, 11, '2025-03-23 08:59:48'),
(11, 13, 11, '2025-03-23 09:02:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('job_seeker','employer') COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'asf@gmail.com', '$2b$10$ilgwCAGT8Rlr4gWDNaUxd.gOGHdy1oa1fiab.jYA7gqlbOZIWfHbq', 'job_seeker', '2025-03-22 12:53:12'),
(2, 'qw@gmail.com', '$2b$10$IiBxkLR7zOVefb6QCRHYDOwh2omRVFuBRrr11IzmECzrGbrr1Vv0u', 'job_seeker', '2025-03-22 12:54:40'),
(3, 'zx@gmail.com', '$2b$10$OuQr6.ZFc9oVK3iZ7NWGcu4KKvTaQT1mkGFZ4keEHTs5.DIMYPmKm', 'job_seeker', '2025-03-22 13:15:22'),
(4, 'zxc@gmail.com', '$2b$10$d08R0ppSTgu9gUAV4n5IOeZq6A5qzgQGQGj2hltdcilrUS.1A8zdW', 'employer', '2025-03-22 13:23:15'),
(5, 'zxcv@gmail.com', '$2b$10$zogBM8Wmkt5u5M2Oo.wEe.KkSGkdTVt5xDnXzqQCPw9Gg.4uQseo.', 'job_seeker', '2025-03-22 13:24:43'),
(6, 'z@gmail.com', '$2b$10$VYQec10eI7hHAz/qgY59rOfieGseKiv3EwyceMThUxOBC71.wj9Z2', 'employer', '2025-03-22 17:01:54'),
(7, 'x@gmail.com', '$2b$10$PRAqkq9QHLg1e7whqYN0HODIJD4gOJd3/2evXie7vH9tVlS/QIJFG', 'job_seeker', '2025-03-22 17:05:45'),
(8, 'c@gmail.com', '$2b$10$gUS6qDmvubz0EzhUDnbCPuVvtDzL001L0lROe65XVR4h3t0yzeoEi', 'employer', '2025-03-22 17:10:38'),
(9, 'r@gmail.com', '$2b$10$Q9CUWHjcOk8/bLpcz6GWs.f1jMZSLecxg5d49TVB/1xUg9yWrokY6', 'job_seeker', '2025-03-22 17:36:59'),
(10, 'rr@gmail.com', '$2b$10$b9w8iuKXF98K6ELuIhdJl.bjDrgQq.hxZnFEja8i84yN5TMoPlrNG', 'employer', '2025-03-22 17:38:41'),
(11, 'e@gmail.com', '$2b$10$gxNOYK84VcHLxWBQXlIFXOmMblJ6JenThiSpqSz3MrznKf4AFl8TS', 'job_seeker', '2025-03-22 17:40:02'),
(12, 'boza@gmail.com', '$2b$10$KRpH9A3FcQm4qcycUPwkAONV86hKmbHQzO4szRNZeBGYNSHnwWya2', 'employer', '2025-03-22 19:11:10'),
(13, 'ansif@gmail.com', '$2b$10$6bTQpMkCGHtasjHVsCm/m.fNks/Q0H99Mjd91XtsZVswPapd9LVte', 'job_seeker', '2025-03-22 19:12:23'),
(14, 'b@gmail.com', '$2b$10$R8aeRgU3m4iXjmm7AvhToOi5zIVWrISG0tVzR9T9hjNKkd7oDlly2', 'employer', '2025-03-22 20:06:36'),
(15, 'bb@gmail.com', '$2b$10$uCJXP0YPfDYrrMCG2vE95OqAF0I1bs0FZDXr0FdwPxLfaBjp8QDf.', 'job_seeker', '2025-03-22 20:08:15'),
(16, 'a@gmail.com', '$2b$10$2CVi1pVtKO9FPkjMfVzYMenPLgZZCrPRO9N5jscje4QKc8QlLwBHO', 'job_seeker', '2025-03-23 07:34:36'),
(17, 's@gmail.com', '$2b$10$uHsqnjdrh9AfGYY3DzV0cuwgfoW.OntHrw8PKf.WZ3rl5P9Mv7pGS', 'job_seeker', '2025-03-23 07:36:09'),
(18, 'd@gmail.com', '$2b$10$qXJQIPsP2yxMQxvzS89bU.B.sRla2eZoMyRT8fbRA5yorjlzpJfpa', 'job_seeker', '2025-03-23 07:36:30'),
(19, 'q@gmail.com', '$2b$10$2se04XeeR.Kkgt.DozPIIuasfUoeR.sAeSRSAWWEA8duFJ1/q39q6', 'employer', '2025-03-23 07:37:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`);

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `saved_jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `saved_jobs_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
