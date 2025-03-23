-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               11.6.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping data for table pubquiz_db.answers: ~0 rows (approximately)

-- Dumping data for table pubquiz_db.menu_categories: ~4 rows (approximately)
INSERT INTO `menu_categories` (`id`, `name`, `description`, `display_order`, `created_at`) VALUES
	(1, 'Drinks', 'Refreshing beverages', 1, '2025-03-12 18:43:23'),
	(2, 'Appetizers', 'Start with something tasty', 2, '2025-03-12 18:43:23'),
	(3, 'Main Courses', 'Delicious mains', 3, '2025-03-12 18:43:23'),
	(4, 'Desserts', 'Sweet treats', 4, '2025-03-12 18:43:23');

-- Dumping data for table pubquiz_db.menu_items: ~9 rows (approximately)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `description`, `price`, `image_path`, `is_available`, `is_popular`, `display_order`, `created_at`) VALUES
	(1, 1, 'Beer', 'Local draft beer', 5.00, NULL, 1, 1, 1, '2025-03-12 18:43:23'),
	(2, 1, 'Wine', 'Glass of house wine', 6.50, NULL, 1, 0, 2, '2025-03-12 18:43:23'),
	(3, 1, 'Soft Drink', 'Coke, Sprite, Fanta', 3.00, NULL, 1, 0, 3, '2025-03-12 18:43:23'),
	(4, 2, 'Nachos', 'Tortilla chips with cheese, salsa, and guacamole', 8.50, NULL, 1, 1, 1, '2025-03-12 18:43:23'),
	(5, 2, 'Wings', 'Spicy chicken wings with blue cheese dip', 9.50, NULL, 1, 0, 2, '2025-03-12 18:43:23'),
	(6, 3, 'Burger', 'Classic beef burger with fries', 12.00, NULL, 1, 1, 1, '2025-03-12 18:43:23'),
	(7, 3, 'Pizza', 'Margherita pizza with tomato and mozzarella', 13.50, NULL, 1, 0, 2, '2025-03-12 18:43:23'),
	(8, 4, 'Ice Cream', 'Selection of ice cream flavors', 5.00, NULL, 1, 0, 1, '2025-03-12 18:43:23'),
	(9, 4, 'Cheesecake', 'New York style cheesecake', 6.50, NULL, 1, 1, 2, '2025-03-12 18:43:23');

-- Dumping data for table pubquiz_db.menu_item_options: ~4 rows (approximately)
INSERT INTO `menu_item_options` (`id`, `menu_item_id`, `name`, `price_addition`, `created_at`) VALUES
	(1, 1, 'Large', 2.00, '2025-03-12 18:43:23'),
	(2, 6, 'Extra cheese', 1.50, '2025-03-12 18:43:23'),
	(3, 6, 'Bacon', 2.00, '2025-03-12 18:43:23'),
	(4, 7, 'Extra toppings', 2.50, '2025-03-12 18:43:23');

-- Dumping data for table pubquiz_db.questions: ~2 rows (approximately)
INSERT INTO `questions` (`id`, `room_id`, `text`, `question_type`, `correct_answer`, `points`, `time_limit`, `is_active`, `created_at`) VALUES
	(1, 'sample_room', 'What is the capital of France?', 'TEXT', 'Paris', 1, 30, 0, '2025-03-11 20:49:35'),
	(2, 'sample_room', 'Who wrote "Romeo and Juliet"?', 'TEXT', 'William Shakespeare', 2, NULL, 0, '2025-03-11 20:49:35'),
	(3, 'sample_room', 'What is the chemical symbol for gold?', 'MULTIPLE_CHOICE', 'A', 1, 45, 0, '2025-03-11 20:49:35');

-- Dumping data for table pubquiz_db.question_options: ~4 rows (approximately)
INSERT INTO `question_options` (`id`, `question_id`, `option_letter`, `option_text`) VALUES
	(1, 3, 'A', 'Au'),
	(2, 3, 'B', 'Ag'),
	(3, 3, 'C', 'Fe'),
	(4, 3, 'D', 'Pb');

-- Dumping data for table pubquiz_db.rooms: ~2 rows (approximately)
INSERT INTO `rooms` (`id`, `name`, `is_active`, `created_at`) VALUES
	('sample_room', 'Sample Pub Quiz', 1, '2025-03-11 20:49:35'),
	('test_room', 'Test Room', 1, '2025-03-12 19:03:40'),
	('weekly_quiz', 'Weekly Trivia Night', 1, '2025-03-11 20:49:35');

-- Dumping data for table pubquiz_db.room_admins: ~0 rows (approximately)

-- Dumping data for table pubquiz_db.room_menu_settings: ~0 rows (approximately)
INSERT INTO `room_menu_settings` (`room_id`, `show_menu`, `menu_description`, `created_at`) VALUES
	('sample_room', 1, NULL, '2025-03-12 19:46:46');

-- Dumping data for table pubquiz_db.room_settings: ~0 rows (approximately)

-- Dumping data for table pubquiz_db.teams: ~5 rows (approximately)
INSERT INTO `teams` (`id`, `name`, `password`, `profile_picture`, `slogan`, `total_points`, `created_at`) VALUES
	(1, 'Quiz Masters', '$2b$12$1wYsL8JqHLFvPmrGP7v4geD1nZiFQgzR.cbaE4nyl1oDZtupVJjnO', '/profiles/team1.png', 'Knowledge is power!', 250, '2025-03-11 20:49:35'),
	(2, 'Trivia Kings', '$2b$12$ZkiVo4Ja3xhzI1xH0ZCzwulQwMAn51T/K1JdZX7g35Z7xfJUpmL0G', '/profiles/team2.png', 'We reign supreme!', 180, '2025-03-11 20:49:35'),
	(3, 'Brain Brigade', '$2b$12$KoKReMQZ2Yc2LgU5ja22XecFrCvJ87VrTcjXcQFEDlGlEFYwZVO2C', NULL, 'Using our brains for good', 120, '2025-03-11 20:49:35'),
	(4, 'bumbar', '$2b$12$y1a3cgRVEJYiX6LKemv.LuQaBx.nhgPA67gbjfpmEuxOh.UOuSnnq', NULL, NULL, 0, '2025-03-12 19:46:45'),
	(5, 'lol1232', '$2b$12$Z5c0rPSjYkszwuSxu3a80eTOqr.LWjM1TegMyoTXw2Md0CVA5HuI.', NULL, NULL, 0, '2025-03-12 20:51:54'),
	(6, 'asdasds', '$2b$12$THMs4y5FngrXFEzAYljcBelaM.d81LK4MQl4oWWBqsuH/OgIbgheK', NULL, NULL, 0, '2025-03-20 16:43:14');

-- Dumping data for table pubquiz_db.team_history: ~0 rows (approximately)

-- Dumping data for table pubquiz_db.team_room_participation: ~7 rows (approximately)
INSERT INTO `team_room_participation` (`id`, `team_id`, `room_id`, `points`, `joined_at`) VALUES
	(1, 1, 'sample_room', 150, '2025-03-11 20:49:35'),
	(2, 2, 'sample_room', 120, '2025-03-11 20:49:35'),
	(3, 3, 'sample_room', 90, '2025-03-11 20:49:35'),
	(4, 1, 'weekly_quiz', 100, '2025-03-11 20:49:35'),
	(5, 2, 'weekly_quiz', 60, '2025-03-11 20:49:35'),
	(6, 4, 'sample_room', 0, '2025-03-12 19:46:45'),
	(7, 5, 'sample_room', 0, '2025-03-12 20:51:54'),
	(8, 6, 'sample_room', 0, '2025-03-20 16:43:14');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
