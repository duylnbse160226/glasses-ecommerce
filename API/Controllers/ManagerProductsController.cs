using Application.Core;
using Application.Products.Commands;
using Application.Products.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = "Manager")]
[Route("api/manager/products")]
public sealed class ManagerProductsController : BaseApiController
{
    // ────────────────────────── PRODUCT ──────────────────────────

    /// <summary>
    /// Tạo Product mới. Mặc định Status = Draft — publish bằng cách PUT với Status = Active.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Guid>> CreateProduct(CreateProductDto dto, CancellationToken ct)
    {
        Result<Guid> result = await Mediator.Send(new CreateProduct.Command { Dto = dto }, ct);

        if (!result.IsSuccess)
            return HandleResult(result);

        return CreatedAtAction(nameof(CreateProduct), new { id = result.Value }, result.Value);
    }

    /// <summary>
    /// Cập nhật thông tin Product (partial update). Type không thể thay đổi.
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, UpdateProductDto dto, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(
            new UpdateProduct.Command { ProductId = id, Dto = dto }, ct));
    }

    /// <summary>
    /// Deactivate Product (soft delete). Thất bại nếu còn variant có đơn hàng đang active.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(
            new DeleteProduct.Command { ProductId = id }, ct));
    }

    // ────────────────────────── VARIANTS ──────────────────────────

    /// <summary>
    /// Thêm Variant mới vào Product. SKU phải unique toàn hệ thống.
    /// </summary>
    [HttpPost("{id:guid}/variants")]
    public async Task<ActionResult<Guid>> AddVariant(Guid id, CreateVariantDto dto, CancellationToken ct)
    {
        Result<Guid> result = await Mediator.Send(
            new AddVariant.Command { ProductId = id, Dto = dto }, ct);

        if (!result.IsSuccess)
            return HandleResult(result);

        return CreatedAtAction(nameof(AddVariant), new { id, variantId = result.Value }, result.Value);
    }

    /// <summary>
    /// Cập nhật Variant (partial update). Có thể dùng để toggle IsActive.
    /// </summary>
    [HttpPut("{id:guid}/variants/{variantId:guid}")]
    public async Task<IActionResult> UpdateVariant(Guid id, Guid variantId, UpdateVariantDto dto, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(
            new UpdateVariant.Command { ProductId = id, VariantId = variantId, Dto = dto }, ct));
    }

    /// <summary>
    /// Deactivate Variant (soft delete). Thất bại nếu variant có đơn hàng đang active.
    /// </summary>
    [HttpDelete("{id:guid}/variants/{variantId:guid}")]
    public async Task<IActionResult> DeleteVariant(Guid id, Guid variantId, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(
            new DeleteVariant.Command { ProductId = id, VariantId = variantId }, ct));
    }

    // ────────────────────────── PRODUCT IMAGES ──────────────────────────

    /// <summary>
    /// Thêm product-level image (lifestyle/catalog). Không dùng cho images của variant cụ thể.
    /// Upload file trước qua POST /api/uploads/image để lấy ImageUrl.
    /// </summary>
    [HttpPost("{id:guid}/images")]
    public async Task<ActionResult<Guid>> AddProductImage(Guid id, AddProductImageDto dto, CancellationToken ct)
    {
        Result<Guid> result = await Mediator.Send(
            new AddProductImage.Command { ProductId = id, Dto = dto }, ct);

        if (!result.IsSuccess)
            return HandleResult(result);

        return CreatedAtAction(nameof(AddProductImage), new { id, imageId = result.Value }, result.Value);
    }

    /// <summary>
    /// Soft delete một image (IsDeleted = true). Dùng cho cả product-level và variant-level.
    /// </summary>
    [HttpDelete("{id:guid}/images/{imageId:guid}")]
    public async Task<IActionResult> DeleteProductImage(Guid id, Guid imageId, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(
            new DeleteProductImage.Command { ProductId = id, ImageId = imageId }, ct));
    }

    /// <summary>
    /// Sắp xếp lại thứ tự ảnh của Product. Phải truyền đầy đủ tất cả ImageId (cả product và variant level).
    /// </summary>
    [HttpPut("{id:guid}/images/reorder")]
    public async Task<IActionResult> ReorderProductImages(Guid id, ReorderImagesDto dto, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(
            new ReorderProductImages.Command { ProductId = id, Dto = dto }, ct));
    }

    // ────────────────────────── VARIANT IMAGES ──────────────────────────

    /// <summary>
    /// Thêm variant-level image (ảnh màu sắc / góc chụp của variant cụ thể).
    /// Upload file trước qua POST /api/uploads/image để lấy ImageUrl.
    /// </summary>
    [HttpPost("{id:guid}/variants/{variantId:guid}/images")]
    public async Task<ActionResult<Guid>> AddVariantImage(Guid id, Guid variantId, AddVariantImageDto dto, CancellationToken ct)
    {
        Result<Guid> result = await Mediator.Send(
            new AddVariantImage.Command { ProductId = id, VariantId = variantId, Dto = dto }, ct);

        if (!result.IsSuccess)
            return HandleResult(result);

        return CreatedAtAction(nameof(AddVariantImage), new { id, variantId, imageId = result.Value }, result.Value);
    }
}

