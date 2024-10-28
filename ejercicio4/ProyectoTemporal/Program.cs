using System;
using System.Data;
using System.IO;
using MySql.Data.MySqlClient;

class Program
{
    static void Main()
    {
        string connectionString = "Server=localhost;Database=ejercicio3DB;UserId=root;Password=;Port=3306;";

        using (MySqlConnection connection = new MySqlConnection(connectionString))
        {
            connection.Open();

string csvFilePath = "C:\\Users\\U-tad\\Downloads\\PruebasCandidatos\\Customers\\Customers.csv";
            using (StreamReader reader = new StreamReader(csvFilePath))
            {
                string headerLine = reader.ReadLine();

                while (!reader.EndOfStream)
                {
                    string line = reader.ReadLine();
                    var values = line.Split(';'); 

                    string insertQuery = "INSERT INTO Customers (Id, Name, Address, City, Country, PostalCode, Phone) VALUES (@Id, @Name, @Address, @City, @Country, @PostalCode, @Phone)";
                    using (MySqlCommand command = new MySqlCommand(insertQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Id", values[0]);
                        command.Parameters.AddWithValue("@Name", values[1]);
                        command.Parameters.AddWithValue("@Address", values[2]);
                        command.Parameters.AddWithValue("@City", values[3]);
                        command.Parameters.AddWithValue("@Country", values[4]);
                        command.Parameters.AddWithValue("@PostalCode", values[5]);
                        command.Parameters.AddWithValue("@Phone", values[6]);

                        int rowsAffected = command.ExecuteNonQuery();
                        Console.WriteLine($"{rowsAffected} row(s) inserted for Id: {values[0]}");
                    }
                }
            }
        }
    }
}
