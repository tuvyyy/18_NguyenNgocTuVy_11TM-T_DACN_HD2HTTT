using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Services;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.AspNetCore.HttpOverrides;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// JSON UTF8 
// ======================================================
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
});

// ======================================================
// DATABASE
// ======================================================
builder.Services.AddDbContext<DACNDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ======================================================
// DEPENDENCY INJECTION
// ======================================================
builder.Services.AddScoped<ICodeGenerator, CodeGenerator>();
builder.Services.AddScoped<PricingService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<DonThuocValidatorService>();
builder.Services.AddScoped<IHoaDonService, HoaDonService>();

builder.Services.AddHttpContextAccessor();

// ======================================================
// CORS
// ======================================================
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowReactApp", p =>
        p.WithOrigins("http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod()
         .AllowCredentials());
});

// ======================================================
// JWT AUTH
// ======================================================
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.RequireHttpsMetadata = false;
    opt.SaveToken = true;

    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

        NameClaimType = "sub",
        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"

    };
});

// ======================================================
// CONTROLLERS + SWAGGER
// ======================================================
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DACN API", Version = "v1" });

    var security = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    };

    c.AddSecurityDefinition("Bearer", security);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { security, new string[]{} }
    });
});

var app = builder.Build();

// ======================================================
// MIDDLEWARE PIPELINE — THỨ TỰ CHUẨN
// ======================================================

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// MUST BE BEFORE Authentication
app.UseRouting();

app.UseCors("AllowReactApp");

// MUST BE BETWEEN Routing and Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

