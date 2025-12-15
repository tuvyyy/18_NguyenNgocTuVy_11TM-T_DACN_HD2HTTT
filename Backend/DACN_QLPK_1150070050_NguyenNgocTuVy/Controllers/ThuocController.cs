using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DACN_QLPK_1150070050_NguyenNgocTuVy.Data;

[ApiController]
[Route("api/[controller]")]
public class ThuocController : ControllerBase
{
    private readonly DACNDbContext _db;
    public ThuocController(DACNDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Thuocs
            .Select(x => new { x.Id, x.Ten, x.DonGia })
            .ToListAsync();

        return Ok(list);
    }
}
