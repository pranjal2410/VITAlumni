/*GENERATE DATABASE IF DOES NOT EXIST*/
DROP DATABASE IF EXISTS BOM;
CREATE DATABASE BOM;
USE BOM;
##CREATE TABLES OF COMPONENTS

CREATE TABLE RESISTORS(
    	COMP_NAME  VARCHAR(30),
    	COMP_ID INT PRIMARY KEY AUTO_INCREMENT,
    	COMP_VAL DECIMAL(16,8),
    	COMP_RATING DECIMAL(4,2),
    	COMP_COST DECIMAL(8,4),
    	COMP_TYPE VARCHAR(30)
);

CREATE TABLE CAPACITORS(
	COMP_NAME VARCHAR(30),
	COMP_ID INT PRIMARY KEY AUTO_INCREMENT,
   	COMP_VAL DECIMAL(16,8),
    	COMP_RATING DECIMAL(4,2),
    	COMP_COST DECIMAL(8,4),
    	COMP_TYPE VARCHAR(30)
);

CREATE TABLE TRANSISTORS(
	COMP_NAME VARCHAR(30),
	COMP_ID INT PRIMARY KEY AUTO_INCREMENT,
    	COMP_VAL VARCHAR(30),
    	COMP_RATING DECIMAL(4,2),
    	COMP_COST DECIMAL(8,4),
    	COMP_TYPE VARCHAR(30),
    	COMP_MANUFACTURER VARCHAR(30)
);

CREATE TABLE DIODES(
	COMP_NAME VARCHAR(30),
	COMP_ID INT PRIMARY KEY AUTO_INCREMENT,
    	COMP_VAL VARCHAR(30),
    	COMP_RATING DECIMAL(4,2),
    	COMP_COST DECIMAL(8,4),
    	COMP_TYPE VARCHAR(30)
);




##IC
CREATE TABLE IC(
	COMP_NAME VARCHAR(30),
	COMP_ID INT PRIMARY KEY AUTO_INCREMENT,
    	COMP_VAL VARCHAR(30),
    	COMP_RATING DECIMAL(4,2),
    	COMP_COST DECIMAL(8,4),
    	COMP_TYPE VARCHAR(30),
    	COMP_MANUFACTURER VARCHAR(30)
);

CREATE TABLE BILL(
	COMP_NAME VARCHAR(30),
	COMP_ID INT PRIMARY KEY AUTO_INCREMENT,
    	COMP_VAL VARCHAR(30),
    	COMP_RATING DECIMAL(4,2),
    	COMP_COST DECIMAL(8,4),
    	COMP_TYPE VARCHAR(30),
    	COMP_MANUFACTURER VARCHAR(30),
    	QUANTITY INT,
    	SUBTOTAL FLOAT AS(QUANTITY*COMP_COST)
);


/*INSERT THE VALUES INTO TABLE*/
INSERT INTO RESISTORS(COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE)
VALUES
	(10,0.5,5,'MFR'),
    	(30,0.25,10,'CFR'),
    	(10,0.5,7,'CFR'),
    	(100,0.25,12,'MFR'),
    	(330,0.5,13,'MFR'),
    	(220,0.5,18,'MFR'),
    	(100,0.5,9,'MFR'),
    	(10,0.5,5,'CFR'),
    	(1000,0.5,20,'MFR'),
    	(770,0.25,20,'CFR'),
    	(10000,0.5,23,'MFR')
;
UPDATE RESISTORS SET COMP_NAME='RESISTOR';
SELECT * FROM RESISTORS;
INSERT INTO CAPACITORS(COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE)
VALUES
	(0.00005,0.25,10,'ELECTROLYTE'),
    	(0.000015,0.5,10,'CERAMIC'),
    (0.000025,0.25,10,'ELECTROLYTE'),
    (0.00009,0.25,10,'CERAMIC'),
    (0.0002,0.5,10,'CERAMIC'),
    (0.00006,0.25,10,'ELECTROLYTE'),
    (0.00003,0.5,10,'ELECTROLYTE'),
    (0.00008,0.25,10,'CERAMIC'),
    (0.000011,0.5,10,'ELECTROLYTE'),
    (0.000077,0.5,10,'CERAMIC'),
    (0.00004,0.25,10,'ELECTROLYTE'),
    (0.000055,0.5,10,'CERAMIC'),
    (0.000035,0.5,10,'ELECTROLYTE');

UPDATE CAPACITORS SET COMP_NAME='CAPACITOR';

SELECT * FROM CAPACITORS;
INSERT INTO TRANSISTORS(COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE,COMP_MANUFACTURER)
VALUES
('2N3055',1.5,10,'TO-92','VISHAY COMPONENTS'),
('BD140',3.25,10,'TO-92','VISHAY COMPONENTS'),
('BS250',2.25,10,'T-12692','VISHAY COMPONENTS'),
('TIP122',5.5,10,'TO-92','CONTINENTAL'),
('IRF640',4.25,10,'TO-126','VISHAY COMPONENTS'),
('2N3055',0.5,10,'TO-92','VISHAY COMPONENTS'),
('BD140',2.25,10,'TO-92','VISHAY COMPONENTS'),
('BD138',4.25,10,'T-12692','CONTINENTAL'),
('TIP122',0.5,10,'TO-92','VISHAY COMPONENTS'),
('BD138',0.25,10,'TO-126','CONTINENTAL')
;
UPDATE TRANSISTORS SET COMP_NAME='TRANSISTOR';
SELECT * FROM TRANSISTORS;
INSERT INTO DIODES(COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE)
VALUES
('1N4007',0.5,5,'DO-35'),
('1N4007',1.5,2,'DO-41'),
('BYV26A',2,3,'DO-41'),
('1N4007',0.25,5,'DO-35'),
('1N5400',0.5,5,'DO-41'),
('BYQ28E',0.55,5,'DO-35'),
('1N4007',0.6,5,'DO-41'),
('1N4007',0.65,7,'DO-35'),
('L5MM',0.65,6,'D5MM'),
('1N4007',0.25,5,'DO-35'),
('1N4007',0.45,4,'DO-35'),
('1N5400',0.5,4,'DO-41'),
('1N4733A',0.65,3,'DO-35'),
('1N4733A',0.65,2,'DO-35'),
('1N4007',0.55,1,'DO-41');
UPDATE DIODES SET COMP_NAME='DIODE';
SELECT * FROM DIODES;
INSERT INTO IC(COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE,COMP_MANUFACTURER)
VALUES
('LF356',10,10,'OP-AMP','NATIONAL SEMICONDUCTORS'),
('LF356',0.5,20,'OP-AMP','NATIONAL SEMICONDUCTORS'),
('LM78XX',6,10,'REGULATOR','NATIONAL SEMICONDUCTORS'),
('LM337',0.5,10,'ADJ REGULATOR','NATIONAL SEMICONDUCTORS'),
('LF356',7,15,'OP-AMP','NATIONAL SEMICONDUCTORS'),
('LF356',0.25,30,'OP-AMP','ONSEMI'),
('LF356',0.5,20,'OP-AMP','NATIONAL SEMICONDUCTORS'),
('LF356',10,20,'OP-AMP','NATIONAL SEMICONDUCTORS'),
('LM337',0.5,15,'ADJ REGULATOR','NATIONAL SEMICONDUCTORS'),
('LM79XX',0.5,10,'REGULATOR','MICROCHIP'),
('PIC16F84',18,50,'MICROCONTROLLER','ATMEL/MICROCHIP'),
('LF356',5,10,'OP-AMP','NATIONAL SEMICONDUCTORS');
UPDATE IC SET COMP_NAME='IC';
SELECT * FROM IC;
/*SELECT COMPONENTS AND ADD THEM TO BILL OF MATERIAL*/

INSERT INTO BILL(COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE)
SELECT COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE FROM RESISTORS
WHERE COMP_VAL=100 AND COMP_TYPE LIKE 'MFR' AND COMP_COST=12;
UPDATE BILL SET QUANTITY = 2 WHERE COMP_NAME='RESISTOR' ;

INSERT INTO BILL(COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE)
SELECT COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE FROM CAPACITORS
WHERE COMP_VAL=0.00006 AND COMP_TYPE='ELECTROLYTE';
UPDATE BILL SET QUANTITY = 5 WHERE COMP_NAME='CAPACITOR';


INSERT INTO BILL(COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE,COMP_MANUFACTURER)
SELECT COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE,COMP_MANUFACTURER FROM TRANSISTORS
WHERE COMP_VAL='IRF640' AND COMP_MANUFACTURER='VISHAY COMPONENTS';
UPDATE BILL SET QUANTITY = 2 WHERE COMP_TYPE='TO-126';

INSERT INTO BILL(COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE)
SELECT COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE FROM TRANSISTORS
WHERE COMP_VAL='BYQ28E'  ;
UPDATE BILL SET QUANTITY = 2 WHERE COMP_NAME='DIODE';


INSERT INTO BILL(COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE,COMP_MANUFACTURER)
SELECT COMP_NAME,COMP_VAL,COMP_RATING,COMP_COST,COMP_TYPE,COMP_MANUFACTURER FROM IC
WHERE COMP_VAL='LM337' AND COMP_COST=15;
UPDATE BILL SET QUANTITY = 1 WHERE COMP_NAME='IC';

SELECT * FROM BILL;
SELECT SUM(SUBTOTAL) FROM BILL;