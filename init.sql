-- Create database
DROP DATABASE IF EXISTS umb888;
CREATE DATABASE umb888;

-- Use database
USE umb888;

-- Create table PaymentMethods
CREATE TABLE PaymentMethods (
    CardID INT PRIMARY KEY AUTO_INCREMENT,
    CardNumber VARCHAR(16),
    CardName VARCHAR(255),
    CVV VARCHAR(4),
    ExpireDate DATE
);

-- Create table Accounts
CREATE TABLE Accounts (
    AccountID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(40),
    LastName VARCHAR(40),
    Email VARCHAR(255),
    DateOfBirth DATE,
    Phone VARCHAR(15),
    CardID INT,
    ZIPCode VARCHAR(10),
    Street VARCHAR(255),
    City VARCHAR(100),
    Province VARCHAR(100),
    FOREIGN KEY (CardID) REFERENCES PaymentMethods(CardID)
);

-- Create table Stations
CREATE TABLE Stations (
    StationID INT PRIMARY KEY AUTO_INCREMENT,
    StationName VARCHAR(255),
    Longitude DECIMAL(9,6),
    Latitude DECIMAL(9,6),
    Capacity INT
);

-- Create tabel Umbrellas
CREATE TABLE Umbrellas (
    UmbrellaID INT PRIMARY KEY AUTO_INCREMENT,
    Size VARCHAR(10),
    Color VARCHAR(40),
    CurrentStationID INT,
    FOREIGN KEY (CurrentStationID) REFERENCES Stations(StationID)
);

-- Create table RentalHistories
CREATE TABLE RentalHistories (
    RentalHistoryID INT PRIMARY KEY AUTO_INCREMENT,
    AccountID INT,
    DestinationStationID INT,
    StartStationID INT,
    UmbrellaID INT,
    StartRentalTime DATETIME,
    EndRentalTime DATETIME,
    Price INT,
    FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID),
	FOREIGN KEY (DestinationStationID) REFERENCES Stations(StationID),
    FOREIGN KEY (StartStationID) REFERENCES Stations(StationID),
    FOREIGN KEY (UmbrellaID) REFERENCES Umbrellas(UmbrellaID)
);

-- Create table Maintainers
CREATE TABLE Maintainers (
    MaintainerID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(40),
    LastName VARCHAR(40),
    Phone VARCHAR(15),
    Email VARCHAR(255),
    DateOfBirth DATE,
    ZIPCode VARCHAR(10),
    Street VARCHAR(255),
    City VARCHAR(100),
    Province VARCHAR(100),
    Salary DECIMAL(10, 2)
);

-- Create table MaintenanceHistories
CREATE TABLE MaintenanceHistories (
    MaintenanceHistoryID INT PRIMARY KEY AUTO_INCREMENT,
    MaintenanceTime DATETIME,
    MaintainerID INT,
    StationID INT,
    Report TEXT,
    FOREIGN KEY (MaintainerID) REFERENCES Maintainers(MaintainerID),
    FOREIGN KEY (StationID) REFERENCES Stations(StationID)
);

-- Insert data into Stations
INSERT INTO Stations (StationName, Longitude, Latitude, Capacity) VALUES
('Station A', 98.950880, 18.799331, 8),
('Station B', 98.951569, 18.799590, 9),
('Station C', 98.951859, 18.801241, 7),
('Station D', 98.950415, 18.800453, 10),
('Station E', 98.952605, 18.801105, 12),
('Station F', 98.950922, 18.806024, 13),
('Station G', 98.950873, 18.803578, 11);

-- Insert data into PaymentMethods
INSERT INTO PaymentMethods (CardNumber, CardName, CVV, ExpireDate) VALUES
('1234567812345678', 'John Doe', '123', '2025-01-30'),
('2345678923456789', 'Jane Smith', '456', '2026-02-28'),
('3456789034567890', 'Alice Johnson', '789', '2025-03-30'),
('4567890145678901', 'Bob Williams', '321', '2024-04-30');

-- Insert data into Accounts
INSERT INTO Accounts (FirstName, LastName, Email, DateOfBirth, Phone, CardID, ZIPCode, Street, City, Province) VALUES
('John', 'Doe', 'john.doe@example.com', '1990-01-01', '1234567890', 1, '50000', '123 Elm Street', 'Chiang Mai', 'Chiang Mai'),
('Jane', 'Smith', 'jane.smith@example.com', '1992-02-02', '0987654321', 2, '50001', '456 Oak Street', 'Chiang Mai', 'Chiang Mai'),
('Alice', 'Johnson', 'alice.j@example.com', '1985-05-15', '1112223333', 3, '50002', '789 Pine Street', 'Chiang Mai', 'Chiang Mai'),
('Bob', 'Williams', 'bob.w@example.com', '1988-08-08', '4445556666', 4, '50003', '987 Maple Street', 'Chiang Mai', 'Chiang Mai');

-- Insert data into Umbrellas
INSERT INTO Umbrellas (Size, Color, CurrentStationID) VALUES
('Large', 'Red', 1),
('Medium', 'Blue', 2),
('Small', 'Green', 3),
('Large', 'Yellow', 4),
('Medium', 'Black', 5),
('Small', 'Purple', 6),
('Large', 'White', 7);

-- Insert data into RentalHistories
INSERT INTO RentalHistories (AccountID, DestinationStationID, StartStationID, UmbrellaID, StartRentalTime, EndRentalTime, Price)
VALUES
(1, 5, 1, 1, '2024-10-01 08:00:00', '2024-10-01 10:00:00', 100), -- 1 - 5
(2, 7, 2, 2, '2024-10-02 10:30:00', '2024-10-02 12:30:00', 1000), -- 2 - 7
(3, 7, 3, 3, '2024-10-03 12:00:00', '2024-10-03 14:00:00', 25000), -- 3 - 7
(4, 4, 1, 4, '2024-10-04 13:15:00', '2024-10-04 14:15:00', 20), -- 1 - 4
(1, 3, 5, 5, '2024-10-05 15:00:00', '2024-10-05 17:00:00', 55), -- 5 - 3
(2, 1, 7, 6, '2024-10-06 16:30:00', '2024-10-06 18:30:00', 200), -- 7 - 1
(3, 2, 7, 7, '2024-10-07 18:00:00', '2024-10-07 19:00:00', 777), -- 7 - 2
(4, 7, 2, 2, '2024-10-08 09:30:00', '2024-10-08 11:30:00', 345), -- 2 - 7
(1, 5, 4, 3, '2024-10-09 11:00:00', '2024-10-09 13:00:00', 123), -- 4 - 5
(2, 7, 5, 4, '2024-10-10 14:00:00', '2024-10-10 16:00:00', 3456), -- 5 - 7
(3, 3, 1, 5, '2024-10-11 17:00:00', '2024-10-11 19:00:00', 1234), -- 1 - 3
(4, 4, 2, 6, '2024-10-12 19:30:00', '2024-10-12 21:30:00', 12345), -- 2 - 4
(1, 1, 3, 1, '2024-10-13 08:15:00', '2024-10-13 10:15:00', 77777), -- 3 - 1
(2, 5, 7, 2, '2024-10-14 10:45:00', '2024-10-14 12:45:00', 99999); -- 7 - 5


-- Insert data into Maintainers
INSERT INTO Maintainers (FirstName, LastName, Phone, Email, DateOfBirth, ZIPCode, Street, City, Province, Salary) VALUES
('Elong', 'Ma', '1112223333', 'elon.musk@spacey.com', '1980-05-01', '50002', '789 Pine Street', 'Chiang Mai', 'Chiang Mai', 30000.00),
('Mark', 'Hamburger', '4445556666', 'mark.hamburger@headbook.com', '1985-07-15', '50003', '987 Maple Street', 'Chiang Mai', 'Chiang Mai', 32000.00);

-- Insert data into MaintenanceHistories
INSERT INTO MaintenanceHistories (MaintenanceTime, MaintainerID, StationID, Report) VALUES
('2024-10-01 08:00:00', 1, 1, 'Performed general maintenance on station A'),
('2024-10-02 10:00:00', 2, 2, 'Repaired umbrella rack at station B'),
('2024-10-03 12:30:00', 1, 3, 'Refilled umbrella stock at station C');


