using AutoMapper;

namespace Hearo.Application.Common.Mappings;

public interface IMapFrom<T>
{
    // Mặc định sẽ tạo map giữa T (Entity) và class kế thừa (DTO)
    void Mapping(Profile profile) => profile.CreateMap(typeof(T), GetType());
}