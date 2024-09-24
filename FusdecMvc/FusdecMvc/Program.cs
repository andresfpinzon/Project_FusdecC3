using FusdecMvc.Data;
using FusdecMvc.Models.Seeds;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using FusdecMvc.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

//builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
//    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

//Error de Permisos 
builder.Services.ConfigureApplicationCookie(options =>
{
    // Aquí configuras la ruta de redirección cuando se niega el acceso
    options.AccessDeniedPath = "/Attendances/AccessDenied";

});

//Email Sender
builder.Services.AddTransient<IEmailSender, FakeEmailSender>();

// Add controllers and views
builder.Services.AddControllersWithViews();

// Add Razor Pages
builder.Services.AddRazorPages();

var app = builder.Build();


// Ensure roles and user are created before running the application
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        await IdentityDataInitializer.SeedData(services);
        var context = services.GetRequiredService<ApplicationDbContext>();

        // llamar al metodo seedAsync
        //await AutorLibroDataInitializer.SeedAsync(context);

    }
    catch (Exception ex)
    {
        // Log the exception or handle it as needed
        var logger = services.GetRequiredService<ILogger<Program>>();
        throw new ApplicationException("An error occurred while seeding the database.", ex);
    }
}



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Agregar auentificacion
app.UseAuthentication();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();
