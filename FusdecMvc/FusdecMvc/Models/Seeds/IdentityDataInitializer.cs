using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System;

namespace FusdecMvc.Models.Seeds
{
    public static class IdentityDataInitializer
    {
        public static async Task SeedData(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await EnsureRoleAsync(roleManager, "Root");
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var email = configuration["SuperUsuarioEmail"];
            var password = configuration["SuperUsuarioPassword"];

            await EnsureUserAsync(userManager, email, password, "Root");
        }

        private static async Task EnsureRoleAsync(RoleManager<IdentityRole> roleManager, string roleName)
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        private static async Task EnsureUserAsync(UserManager<IdentityUser> userManager, string userName, string password, string roleName)
        {
            var user = await userManager.FindByEmailAsync(userName);
            if (user == null)
            {
                user = new IdentityUser { UserName = userName, Email = userName };
                var createUserResult = await userManager.CreateAsync(user, password);
                if (createUserResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, roleName);
                }
            }
        }
    }
}
