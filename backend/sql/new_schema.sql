-- Target New Database Schema
-- Generated to match the requested structure exactly.

CREATE TABLE Person (
    IDPerson INT PRIMARY KEY,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Address VARCHAR(255),
    PhoneNumber VARCHAR(30),
    personalPictureURL VARCHAR(255),
    DocumentsURL VARCHAR(255),
    Email VARCHAR(150) UNIQUE,
    Username VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    Status INT,
    Role INT
);

CREATE TABLE Farmer (
    IDFarmer INT PRIMARY KEY,
    IDPerson INT UNIQUE,
    AverageRating INT,
    TotalReviews INT,
    FOREIGN KEY (IDPerson) REFERENCES Person(IDPerson)
);

CREATE TABLE Buyer (
    IDBuyer INT PRIMARY KEY,
    IDPerson INT UNIQUE,
    FOREIGN KEY (IDPerson) REFERENCES Person(IDPerson)
);

CREATE TABLE Admin (
    IDAdmin INT PRIMARY KEY,
    IDPerson INT UNIQUE,
    TotalProcesses INT,
    RegionCode INT,
    FOREIGN KEY (IDPerson) REFERENCES Person(IDPerson)
);

CREATE TABLE Transporter (
    IDTransporter INT PRIMARY KEY,
    IDPerson INT UNIQUE,
    Capacity INT,
    ServiceArea VARCHAR(255),
    VehicleType VARCHAR(100),
    AverageRating INT,
    TotalReviews INT,
    FOREIGN KEY (IDPerson) REFERENCES Person(IDPerson)
);

CREATE TABLE Farm (
    IDFarm INT PRIMARY KEY,
    IDFarmer INT,
    Location VARCHAR(255) UNIQUE,
    Name VARCHAR(150),
    Area INT,
    FOREIGN KEY (IDFarmer) REFERENCES Farmer(IDFarmer)
);

CREATE TABLE Category (
    IDCategory INT PRIMARY KEY,
    Name VARCHAR(100)
);

CREATE TABLE Product (
    IDProduct INT PRIMARY KEY,
    Name VARCHAR(100),
    IDCategory INT,
    FOREIGN KEY (IDCategory) REFERENCES Category(IDCategory)
);

CREATE TABLE Season (
    IDSeason INT PRIMARY KEY,
    Name VARCHAR(100)
);

CREATE TABLE OfficialPrice (
    IDOfficialPrice INT PRIMARY KEY,
    MaxPrice INT,
    IDSeason INT,
    IDProduct INT,
    IDAdmin INT,
    FOREIGN KEY (IDSeason) REFERENCES Season(IDSeason),
    FOREIGN KEY (IDProduct) REFERENCES Product(IDProduct),
    FOREIGN KEY (IDAdmin) REFERENCES Admin(IDAdmin)
);

CREATE TABLE ProductList (
    IDProductList INT PRIMARY KEY,
    IDProduct INT,
    IDFarmer INT,
    Quantity INT,
    Price INT,
    FOREIGN KEY (IDProduct) REFERENCES Product(IDProduct),
    FOREIGN KEY (IDFarmer) REFERENCES Farmer(IDFarmer)
);

CREATE TABLE Orders (
    IDOrder INT PRIMARY KEY,
    IDBuyer INT,
    IDFarmer INT,
    TotalAmount INT,
    OrderDate TIMESTAMP,
    Status INT,
    DeliveryAddress VARCHAR(255),
    PickupAddress VARCHAR(255),
    FOREIGN KEY (IDBuyer) REFERENCES Buyer(IDBuyer),
    FOREIGN KEY (IDFarmer) REFERENCES Farmer(IDFarmer)
);

CREATE TABLE OrderItem (
    IDOrderItem INT PRIMARY KEY,
    IDOrder INT,
    IDProductList INT,
    Quantity INT,
    Price INT,
    TotalItemsPrice INT,
    FOREIGN KEY (IDOrder) REFERENCES Orders(IDOrder),
    FOREIGN KEY (IDProductList) REFERENCES ProductList(IDProductList)
);

CREATE TABLE Payments (
    IDPayment INT PRIMARY KEY,
    IDOrder INT,
    Amount INT,
    PaymentMethod VARCHAR(100),
    TransactionDate TIMESTAMP,
    FOREIGN KEY (IDOrder) REFERENCES Orders(IDOrder)
);

CREATE TABLE Shipment (
    IDShipping INT PRIMARY KEY,
    IDOrder INT,
    IDTransporter INT,
    TrackingNumber VARCHAR(100),
    Status INT,
    ShippingFee INT,
    PickupDate TIMESTAMP,
    EstimatedDeliveryDate TIMESTAMP,
    ActualDeliveryDate TIMESTAMP,
    FOREIGN KEY (IDOrder) REFERENCES Orders(IDOrder),
    FOREIGN KEY (IDTransporter) REFERENCES Transporter(IDTransporter)
);

CREATE TABLE TransporterReview (
    IDReview INT PRIMARY KEY,
    IDBuyer INT,
    IDShipping INT,
    Rating INT,
    ReviewText VARCHAR(255),
    ReviewDate TIMESTAMP,
    FOREIGN KEY (IDBuyer) REFERENCES Buyer(IDBuyer),
    FOREIGN KEY (IDShipping) REFERENCES Shipment(IDShipping)
);

CREATE TABLE ItemReview (
    IDItemReview INT PRIMARY KEY,
    IDOrderItem INT,
    Rating INT,
    ReviewText VARCHAR(255),
    ReviewDate TIMESTAMP,
    FOREIGN KEY (IDOrderItem) REFERENCES OrderItem(IDOrderItem)
);

CREATE TABLE JoinRequest (
    IDRequest INT PRIMARY KEY,
    IDAdmin INT,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Email VARCHAR(150),
    PhoneNumber VARCHAR(30),
    Address VARCHAR(255),
    RequestedRole INT,
    personalPictureURL VARCHAR(255),
    DocumentsURL VARCHAR(255),
    RequestDate TIMESTAMP,
    ReviewDate TIMESTAMP,
    Notes VARCHAR(255),
    Status INT,
    FOREIGN KEY (IDAdmin) REFERENCES Admin(IDAdmin)
);
