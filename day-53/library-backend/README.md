use library_management;

CREATE VIEW active_borrow_records AS
SELECT
borrow_records.id,
books.title,
members.name AS member_name,
borrow_records.borrowed_at
FROM borrow_records;

CREATE VIEW member*borrow_summary AS
SELECT
members.id,
members.name AS member_name,
COUNT(*) AS total*borrows,
SUM(CASE WHEN returned = FALSE THEN 1 ELSE 0 END) AS active_borrows
FROM borrow_records
JOIN members ON borrow_records.member_id = members.id
GROUP BY members.id;
SELECT * FROM member_borrow_summary;

CREATE VIEW overdue_books_records AS
SELECT
books.title,
members.name AS member_name,
borrow_records.borrowed_at,
DATEDIFF(CURDATE(), borrow_records.borrowed_at) AS days_borrowed
FROM borrow_records
JOIN books ON borrow_records.book_id = books.id
JOIN members ON borrow_records.member_id = members.id
WHERE borrow_records.returned = FALSE
AND DATEDIFF(CURDATE(), borrow_records.borrowed_at) > 14;

CREATE VIEW book_borrow_statistics AS
SELECT
books.id,
books.title,
authors.name AS author_name,
books.copies_available,
COUNT(borrow_records.id) AS total_borrows
FROM books
JOIN authors ON books.author_id = authors.id
LEFT JOIN borrow_records ON books.id = borrow_records.book_id
GROUP BY books.id;

Trigger -
DELIMITER $$

CREATE TRIGGER before_borrow_update
BEFORE UPDATE ON borrow_records
FOR EACH ROW
BEGIN
IF NEW.returned = TRUE AND OLD.returned = FALSE THEN
SET NEW.return_date = CURDATE();
END IF;
END$$

DELIMITER ;

Procedure - Not used but this is the approach
DELIMITER $$

CREATE PROCEDURE borrow_book(IN p_book_id INT, IN p_member_id INT)
BEGIN
DECLARE available INT;
SELECT copies_available INTO available FROM books WHERE id = p_book_id;

IF available > 0 THEN
INSERT INTO borrow_records (book_id, member_id, borrowed_at, returned)
VALUES (p_book_id, p_member_id, CURDATE(), FALSE);
UPDATE books SET copies_available = copies_available - 1 WHERE id = p_book_id;
ELSE
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No copies available';
END IF;
END$$

DELIMITER ;
