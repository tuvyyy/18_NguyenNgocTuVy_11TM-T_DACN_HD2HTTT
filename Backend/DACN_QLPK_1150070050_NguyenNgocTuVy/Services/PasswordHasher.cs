using System.Security.Cryptography;
using System.Text;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Services
{
    public class PasswordHasher : IPasswordHasher
    {
        private const int Iterations = 100000;
        private const int SaltSize = 16;
        private const int KeySize = 32;

        public string HashPassword(string password, string salt)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException(nameof(password), "Password cannot be null or empty.");
            if (string.IsNullOrEmpty(salt))
                throw new ArgumentNullException(nameof(salt), "Salt cannot be null or empty.");

            var saltBytes = Convert.FromBase64String(salt);
            using var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, Iterations, HashAlgorithmName.SHA256);
            var key = pbkdf2.GetBytes(KeySize);
            return Convert.ToBase64String(key);
        }

        public bool Verify(string password, string hash, string salt)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash) || string.IsNullOrEmpty(salt))
                return false;

            try
            {
                var newHash = HashPassword(password, salt);
                return CryptographicOperations.FixedTimeEquals(
                    Convert.FromBase64String(newHash),
                    Convert.FromBase64String(hash)
                );
            }
            catch
            {
                return false;
            }
        }

        public (string hash, string salt) Hash(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException(nameof(password), "Password cannot be null or empty.");

            var saltBytes = RandomNumberGenerator.GetBytes(SaltSize);
            var salt = Convert.ToBase64String(saltBytes);
            var hash = HashPassword(password, salt);
            return (hash, salt);
        }
    }
}
