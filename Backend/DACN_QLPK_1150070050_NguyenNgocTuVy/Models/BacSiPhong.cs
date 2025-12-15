using System;
using System.Collections.Generic;

namespace DACN_QLPK_1150070050_NguyenNgocTuVy.Models;

public partial class BacSiPhong
{
    public long Id { get; set; }

    public long IdBacSi { get; set; }

    public int IdPhong { get; set; }

    public virtual NguoiDung IdBacSiNavigation { get; set; } = null!;

    public virtual PhongKham IdPhongNavigation { get; set; } = null!;
}
